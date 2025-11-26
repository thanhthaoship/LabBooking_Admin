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
  CreateEquipmentMaintainScheduleCommand,
  EquipmentMaintainScheduleResponse,
  EquimentpMaintainStatus,
  GetAllEquipmentsQuery,
  PagedResult,
  EquipmentResponse,
  UpdateEquipmentMaintainScheduleCommand,
} from "../../../lib/types";
import {
  createEquipmentMaintainSchedule,
  updateEquipmentMaintainSchedule,
  getEquipments,
} from "../../../lib/services/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

type Mode = "create" | "edit";

export default function EquipmentMaintainScheduleDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: EquipmentMaintainScheduleResponse | null;
  onSaved: (id?: string | null) => void;
}) {
  const [equipmentId, setEquipmentId] = useState("");
  const [isManyDay, setIsManyDay] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [numberOfSlot, setNumberOfSlot] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<EquimentpMaintainStatus>("NotYet");
  const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const rq: GetAllEquipmentsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 30,
      sortBy: undefined,
      sortDirection: "Ascending",
    };
    getEquipments(rq)
      .then((res: PagedResult<EquipmentResponse>) => setEquipments(res.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setEquipmentId(initial.equipmentId);
      setIsManyDay(initial.isManyDay);
      setIsAllDay(!!initial.isAllDay);
      setStartTime(initial.startTime ? dayjs(initial.startTime) : null);
      setEndTime(initial.endTime ? dayjs(initial.endTime) : null);
      setNumberOfSlot(initial.numberOfSlot ?? "");
      setDescription(initial.description ?? "");
      setStatus(initial.equimentpMaintainStatus ?? "NotYet");
    }
    if (mode === "create") {
      setEquipmentId("");
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
    const okEq = equipmentId.trim().length > 0;
    const okDesc = description.trim().length <= 1000;
    const okSlot = numberOfSlot === "" || (typeof numberOfSlot === "number" && numberOfSlot > 0);
    const okTime = timeOrderValid;
    if (mode === "create") return okEq && isManyDay !== undefined && okDesc && okSlot && okTime && !saving;
    return okEq && isManyDay !== undefined && okDesc && okSlot && okTime && !saving;
  }, [equipmentId, isManyDay, description, numberOfSlot, timeOrderValid, mode, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "create") {
        const payload: CreateEquipmentMaintainScheduleCommand = {
          equipmentId,
          isManyDay,
          isAllDay,
          startTime: startTime ? startTime.toISOString() : undefined,
          endTime: endTime ? endTime.toISOString() : undefined,
          numberOfSlot: typeof numberOfSlot === "number" ? numberOfSlot : undefined,
          description: description.trim() || null,
        };
        const id = await createEquipmentMaintainSchedule(payload);
        setSuccess("Tạo lịch bảo trì thành công");
        onSaved(id ?? null);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateEquipmentMaintainScheduleCommand = {
          equipmentId,
          isManyDay,
          isAllDay,
          startTime: startTime ? startTime.toISOString() : undefined,
          endTime: endTime ? endTime.toISOString() : undefined,
          numberOfSlot: typeof numberOfSlot === "number" ? numberOfSlot : undefined,
          equimentpMaintainStatus: status,
          description: description.trim() || null,
        };
        await updateEquipmentMaintainSchedule(initial.id, payload);
        setSuccess("Cập nhật lịch bảo trì thành công");
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
      <DialogTitle>{mode === "create" ? "Thêm lịch bảo trì" : "Sửa lịch bảo trì"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <TextField select label="Thiết bị" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} fullWidth required size="small">
              {equipments.map((eq) => (
                <MenuItem key={eq.id} value={eq.id}>{eq.equipmentName || eq.id.slice(0, 8).toUpperCase()}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel control={<Switch checked={isManyDay} onChange={(e) => setIsManyDay(e.target.checked)} />} label="Nhiều ngày" />
            <FormControlLabel control={<Switch checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />} label="Cả ngày" />
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
                slotProps={{ textField: { fullWidth: true, size: "small", error: !timeOrderValid, helperText: !timeOrderValid ? "Kết thúc phải sau bắt đầu" : undefined } }}
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
            <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth size="small" multiline minRows={3} inputProps={{ maxLength: 1000 }} />
          </Grid>
          {mode === "edit" && (
            <Grid item xs={12} md={6}>
              <TextField select label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value as EquimentpMaintainStatus)} fullWidth required size="small">
                {(["NotYet", "Done"] as EquimentpMaintainStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
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
        <Button onClick={onClose} startIcon={<CloseIcon />}>Hủy</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} variant="contained" color="primary" startIcon={mode === "create" ? <AddCircleOutlineIcon /> : <SaveIcon />}>{mode === "create" ? "Tạo" : "Lưu"}</Button>
      </DialogActions>
    </Dialog>
  );
}
