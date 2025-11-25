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
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  CreateUsagePolicyCommand,
  GetAllLabRoomsQuery,
  LabRoomResponse,
  PagedResult,
  UpdateUsagePolicyCommand,
  UsagePolicyResponse,
} from "../../../lib/types";
import {
  createUsagePolicy,
  getLabRooms,
  updateUsagePolicy,
} from "../../../lib/services/api";

type Mode = "create" | "edit";

function toIsoOrNull(v?: string): string | null | undefined {
  if (!v) return undefined;
  try {
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

export default function PolicyDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: UsagePolicyResponse | null;
  onSaved: (id?: string | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [forAll, setForAll] = useState(true);
  const [labRoomId, setLabRoomId] = useState<string>("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [rooms, setRooms] = useState<LabRoomResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const rq: GetAllLabRoomsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 30,
      sortBy: undefined,
      sortDirection: "Ascending",
    };
    getLabRooms(rq)
      .then((res: PagedResult<LabRoomResponse>) => setRooms(res.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setTitle(initial.title ?? "");
      setDescription(initial.description ?? "");
      setForAll(initial.forAllLabRooms);
      setLabRoomId(initial.labRoomId ?? "");
      setEffectiveFrom(
        initial.effectiveFrom
          ? new Date(initial.effectiveFrom).toISOString().slice(0, 16)
          : ""
      );
      setExpirationDate(
        initial.expirationDate
          ? new Date(initial.expirationDate).toISOString().slice(0, 16)
          : ""
      );
      setIsActive(initial.isActive);
    }
    if (mode === "create") {
      setTitle("");
      setDescription("");
      setForAll(true);
      setLabRoomId("");
      setEffectiveFrom("");
      setExpirationDate("");
      setIsActive(true);
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const canSubmit = useMemo(() => {
    const t = title.trim().length > 0 && title.trim().length <= 100;
    const descOk = description.trim().length <= 1000;
    const labOk = forAll ? true : labRoomId.trim().length > 0;
    return t && descOk && labOk && !saving;
  }, [title, description, forAll, labRoomId, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "create") {
        const payload: CreateUsagePolicyCommand = {
          title: title.trim(),
          description: description.trim() || null,
          forAllLabRooms: forAll,
          labRoomId: forAll ? null : labRoomId,
          effectiveFrom: toIsoOrNull(effectiveFrom),
          expirationDate: toIsoOrNull(expirationDate),
        };
        const id = await createUsagePolicy(payload);
        setSuccess("Tạo chính sách thành công");
        onSaved(id ?? null);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateUsagePolicyCommand = {
          title: title.trim(),
          description: description.trim() || null,
          forAllLabRooms: forAll,
          labRoomId: forAll ? null : labRoomId,
          effectiveFrom: toIsoOrNull(effectiveFrom),
          expirationDate: toIsoOrNull(expirationDate),
          isActive,
        };
        await updateUsagePolicy(initial.id, payload);
        setSuccess("Cập nhật chính sách thành công");
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
        {mode === "create" ? "Thêm chính sách" : "Sửa chính sách"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
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
              label="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={forAll}
                  onChange={(e) => setForAll(e.target.checked)}
                />
              }
              label="Áp dụng cho tất cả phòng"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Phòng Lab"
              value={labRoomId}
              onChange={(e) => setLabRoomId(e.target.value)}
              fullWidth
              size="small"
              disabled={forAll}
            >
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.labName || r.id.slice(0, 8).toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hiệu lực từ"
              type="datetime-local"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hết hạn"
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          {mode === "edit" && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
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
        <Button onClick={handleSubmit} disabled={!canSubmit} variant="contained" color="primary" startIcon={mode === "create" ? <AddCircleOutlineIcon /> : <SaveIcon />}>{mode === "create" ? "Tạo" : "Lưu"}</Button>
      </DialogActions>
    </Dialog>
  );
}
