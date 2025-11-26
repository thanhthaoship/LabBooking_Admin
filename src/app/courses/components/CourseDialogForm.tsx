"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  CourseResponse,
  CreateCourseCommand,
  UpdateCourseCommand,
} from "../../../lib/types";
import { createCourse, updateCourse } from "../../../lib/services/api";

type Mode = "create" | "edit";

export default function CourseDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: CourseResponse | null;
  onSaved: (id?: string | null) => void;
}) {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setCourseCode(initial.courseCode ?? "");
      setCourseName(initial.courseName ?? "");
      setDescription(initial.description ?? "");
      setIsActive(initial.isActive ?? true);
    }
    if (mode === "create") {
      setCourseCode("");
      setCourseName("");
      setDescription("");
      setIsActive(true);
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const canSubmit = useMemo(() => {
    const code = courseCode.trim().length > 0 && courseCode.trim().length <= 20;
    const name = courseName.trim().length > 0 && courseName.trim().length <= 200;
    const desc = description.trim().length <= 1000;
    return code && name && desc && !saving;
  }, [courseCode, courseName, description, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "create") {
        const payload: CreateCourseCommand = {
          courseCode: courseCode.trim(),
          courseName: courseName.trim(),
          description: description.trim() || null,
        };
        const id = await createCourse(payload);
        setSuccess("Tạo khóa học thành công");
        onSaved(id ?? null);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateCourseCommand = {
          courseCode: courseCode.trim(),
          courseName: courseName.trim(),
          description: description.trim() || null,
          isActive,
        };
        await updateCourse(initial.id, payload);
        setSuccess("Cập nhật khóa học thành công");
        onSaved(initial.id);
        onClose();
      }
    } catch (e: any) {
      setError(e?.message ?? "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Thêm khóa học" : "Sửa khóa học"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Mã khóa học"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              fullWidth
              required
              size="small"
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tên khóa học"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              required
              size="small"
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={3}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>
          {mode === "edit" && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    inputProps={{ "aria-label": "Trạng thái kích hoạt" }}
                  />
                }
                label="Đang hoạt động"
              />
            </Grid>
          )}
        </Grid>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        {success && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">{success}</Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="contained"
          color="primary"
          startIcon={mode === "create" ? <AddCircleOutlineIcon /> : <SaveIcon />}
        >
          {mode === "create" ? "Tạo" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
