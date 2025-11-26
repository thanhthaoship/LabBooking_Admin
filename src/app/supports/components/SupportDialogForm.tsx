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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  CreateSupportCommand,
  SupportsResponse,
  UpdateSupportCommand,
} from "../../../lib/types";
import { createSupport, updateSupport } from "../../../lib/services/api";

type Mode = "create" | "edit";

export default function SupportDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: SupportsResponse | null;
  onSaved: (id?: string | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setTitle(initial.title ?? "");
      setContent(initial.content ?? "");
      setAnswer(initial.answer ?? "");
    }
    if (mode === "create") {
      setTitle("");
      setContent("");
      setAnswer("");
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const canSubmit = useMemo(() => {
    const t = title.trim().length > 0 && title.trim().length <= 100;
    const c = content.trim().length > 0 && content.trim().length <= 1000;
    const a = answer.trim().length <= 2000;
    return t && c && a && !saving;
  }, [title, content, answer, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "create") {
        const payload: CreateSupportCommand = {
          title: title.trim(),
          content: content.trim(),
          status: 0,
        };
        const id = await createSupport(payload);
        setSuccess("Tạo hỗ trợ thành công");
        onSaved(id ?? null);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateSupportCommand = {
          title: title.trim(),
          content: content.trim(),
          answer: answer.trim() || null,
          status: 1,
        };
        await updateSupport(initial.id, payload);
        setSuccess("Cập nhật hỗ trợ thành công");
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
        {mode === "create" ? "Thêm hỗ trợ" : "Sửa hỗ trợ"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {mode === "edit" ? (
            <Grid item xs={12}>
              <TextField
                label="Trả lời"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Tiêu đề"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nội dung"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  multiline
                  minRows={3}
                />
              </Grid>
            </>
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
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="contained"
          color="primary"
          startIcon={
            mode === "create" ? <AddCircleOutlineIcon /> : <SaveIcon />
          }
        >
          {mode === "create" ? "Tạo" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
