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
  CreateRoomMaintainScheduleCommand,
  RoomMaintainScheduleResponse,
  RoomMaintainStatus,
  GetAllLabRoomsQuery,
  LabRoomResponse,
  PagedResult,
  UpdateRoomMaintainScheduleCommand,
} from "../../../lib/types";
import {
  createRoomMaintainSchedule,
  updateRoomMaintainSchedule,
  getLabRooms,
} from "../../../lib/services/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

type Mode = "create" | "edit";

export default function RoomMaintainScheduleDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: RoomMaintainScheduleResponse | null;
  onSaved: (id?: string | null) => void;
}) {
  const [labRoomId, setLabRoomId] = useState("");
  const [isManyDay, setIsManyDay] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [numberOfSlot, setNumberOfSlot] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RoomMaintainStatus>("NotYet");
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
      setLabRoomId(initial.labRoomId);
      setIsManyDay(initial.isManyDay);
      setIsAllDay(!!initial.isAllDay);
      setStartTime(initial.startTime ? dayjs(initial.startTime) : null);
      setEndTime(initial.endTime ? dayjs(initial.endTime) : null);
      setNumberOfSlot(initial.numberOfSlot ?? "");
      setDescription(initial.description ?? "");
      setStatus(initial.roomMaintainStatus ?? "NotYet");
    }
    if (mode === "create") {
      setLabRoomId("");
      setIsManyDay(false);
      setIsAllDay(false);
      setStartTime(null);
      setEndTime(null);
      setNumberOfSlot("");
      setDescription("");
      setStatus("NotYet");
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const timeOrderValid = useMemo(() => {
    if (startTime && endTime) return endTime.isAfter(startTime);
    return true;
  }, [startTime, endTime]);

  const canSubmit = useMemo(() => {
    const okRoom = labRoomId.trim().length > 0;
    const okDesc = description.trim().length <= 1000;
    const okSlot =
      numberOfSlot === "" ||
      (typeof numberOfSlot === "number" && numberOfSlot > 0);
    const okTime = timeOrderValid;
    return (
      okRoom && isManyDay !== undefined && okDesc && okSlot && okTime && !saving
    );
  }, [labRoomId, isManyDay, description, numberOfSlot, timeOrderValid, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "create") {
        const payload: CreateRoomMaintainScheduleCommand = {
          labRoomId,
          isManyDay,
          isAllDay,
          startTime: startTime ? startTime.toISOString() : undefined,
          endTime: endTime ? endTime.toISOString() : undefined,
          numberOfSlot:
            typeof numberOfSlot === "number" ? numberOfSlot : undefined,
          description: description.trim() || null,
        };
        const id = await createRoomMaintainSchedule(payload);
        setSuccess("Tạo lịch bảo trì phòng thành công");
        onSaved(id ?? null);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateRoomMaintainScheduleCommand = {
          labRoomId,
          isManyDay,
          isAllDay,
          startTime: startTime ? startTime.toISOString() : undefined,
          endTime: endTime ? endTime.toISOString() : undefined,
          numberOfSlot:
            typeof numberOfSlot === "number" ? numberOfSlot : undefined,
          roomMaintainStatus: status,
          description: description.trim() || null,
        };
        await updateRoomMaintainSchedule(initial.id, payload);
        setSuccess("Cập nhật lịch bảo trì phòng thành công");
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "create"
          ? "Thêm lịch bảo trì phòng"
          : "Sửa lịch bảo trì phòng"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Phòng Lab"
              value={labRoomId}
              onChange={(e) => setLabRoomId(e.target.value)}
              fullWidth
              required
              size="small"
            >
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.labName || r.id.slice(0, 8).toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={isManyDay}
                  onChange={(e) => setIsManyDay(e.target.checked)}
                />
              }
              label="Nhiều ngày"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                />
              }
              label="Cả ngày"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Thời gian bắt đầu"
                value={startTime}
                onChange={(v) => setStartTime(v)}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Thời gian kết thúc"
                value={endTime}
                onChange={(v) => setEndTime(v)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !timeOrderValid,
                    helperText: !timeOrderValid
                      ? "Kết thúc phải sau bắt đầu"
                      : undefined,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Số slot"
              value={numberOfSlot}
              onChange={(e) => {
                const v = e.target.value;
                const n = Number(v);
                setNumberOfSlot(Number.isNaN(n) ? "" : n);
              }}
              fullWidth
              size="small"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Trạng thái"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as RoomMaintainStatus)
                }
                fullWidth
                required
                size="small"
              >
                {(["NotYet", "Done"] as RoomMaintainStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
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
