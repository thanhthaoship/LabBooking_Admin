"use client";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { MdLocationOn, MdMeetingRoom } from "react-icons/md";
import {
  createLabRoom,
  getUsers,
  updateLabRoom,
} from "../../../lib/services/api";
import {
  CreateLabRoomCommand,
  GetAllUsersQuery,
  LabRoomResponse,
  PagedResult,
  UpdateLabRoomCommand,
  UserResponse,
} from "../../../lib/types";

type Mode = "create" | "edit";

export default function LabRoomDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: LabRoomResponse | null;
  onSaved: (id?: string | null) => void;
}) {
  const [labName, setLabName] = useState("");
  const [location, setLocation] = useState<string | "">("");
  const [maximumLimit, setMaximumLimit] = useState<string>("");
  const [mainManagerId, setMainManagerId] = useState<string>("");
  const [managers, setManagers] = useState<UserResponse[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const q: GetAllUsersQuery = {
      searchPhrase: undefined,
      roleName: "Manager",
      pageNumber: 1,
      pageSize: 50,
      sortBy: "UserName",
      sortDirection: "Ascending",
    };
    getUsers(q)
      .then((res: PagedResult<UserResponse>) => setManagers(res.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setLabName(initial.labName ?? "");
      setLocation(initial.location ?? "");
      setMaximumLimit(
        initial.maximumLimit != null ? String(initial.maximumLimit) : ""
      );
      setMainManagerId(initial.mainManagerId ?? "");
      setIsActive(initial.isActive);
    }
    if (mode === "create") {
      setLabName("");
      setLocation("");
      setMaximumLimit("");
      setMainManagerId("");
      setIsActive(true);
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const canSubmit = useMemo(
    () => labName.trim().length > 0 && !saving,
    [labName, saving]
  );

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "create") {
        const payload: CreateLabRoomCommand = {
          labName: labName.trim(),
          location: location.trim() || null,
          maximumLimit: maximumLimit ? Number(maximumLimit) : null,
          mainManagerId: mainManagerId.trim() || null,
        };
        const id = await createLabRoom(payload);
        onSaved(id ?? null);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateLabRoomCommand = {
          labName: labName.trim(),
          location: location.trim() || null,
          maximumLimit: maximumLimit ? Number(maximumLimit) : null,
          mainManagerId: mainManagerId.trim() || null,
          isActive,
        };
        await updateLabRoom(initial.id, payload);
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      {/* Modern Title */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.3} alignItems="center">
          <MdMeetingRoom size={22} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {mode === "create" ? "Thêm phòng Lab" : "Chỉnh sửa phòng Lab"}
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Lab Name */}
          <Grid item xs={12}>
            <TextField
              label="Tên phòng"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <MdMeetingRoom
                    size={20}
                    style={{ marginRight: 8, opacity: 0.7 }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <TextField
              label="Vị trí"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <MdLocationOn
                    size={20}
                    style={{ marginRight: 8, opacity: 0.7 }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sức chứa"
              type="number"
              value={maximumLimit}
              onChange={(e) => setMaximumLimit(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Quản lý"
              value={mainManagerId}
              onChange={(e) => setMainManagerId(e.target.value)}
              fullWidth
              size="small"
            >
              {managers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.userName || u.email || u.id.slice(0, 8).toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
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

        {/* Messages */}
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

      <Divider sx={{ mt: 1 }} />

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none" }}
          startIcon={<CloseIcon />}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="contained"
          sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
          startIcon={
            mode === "create" ? <AddCircleOutlineIcon /> : <SaveIcon />
          }
        >
          {mode === "create" ? "Tạo mới" : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
