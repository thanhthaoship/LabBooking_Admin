'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CreateSlotCommand, SlotResponse, UpdateSlotCommand } from '../../../lib/types';
import { createSlot, updateSlot } from '../../../lib/services/api';

type Mode = 'create' | 'edit';

function toSeconds(t: string): number {
  const parts = t.split(':').map((p) => Number(p));
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  return h * 3600 + m * 60 + s;
}

function hasOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const a1 = toSeconds(aStart);
  const a2 = toSeconds(aEnd);
  const b1 = toSeconds(bStart);
  const b2 = toSeconds(bEnd);
  return Math.max(a1, b1) < Math.min(a2, b2);
}

export default function SlotDialogForm({ open, onClose, mode, initial, onSaved, existing }: { open: boolean; onClose: () => void; mode: Mode; initial?: SlotResponse | null; onSaved: (id?: string | null) => void; existing: SlotResponse[] }) {
  const [label, setLabel] = useState('');
  const [slotIndex, setSlotIndex] = useState<1 | 2 | 3 | 4>(1);
  const [startTime, setStartTime] = useState('08:00:00');
  const [endTime, setEndTime] = useState('10:00:00');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setLabel(initial.label ?? '');
      setSlotIndex((initial.slotIndex as 1 | 2 | 3 | 4) ?? 1);
      setStartTime(initial.startTime ?? '08:00:00');
      setEndTime(initial.endTime ?? '10:00:00');
    }
    if (mode === 'create') {
      setLabel('');
      setSlotIndex(1);
      setStartTime('08:00:00');
      setEndTime('10:00:00');
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const canSubmit = useMemo(() => {
    const l = label.trim().length > 0;
    const s = toSeconds(startTime);
    const e = toSeconds(endTime);
    const validOrder = e > s;
    return l && validOrder && !saving;
  }, [label, startTime, endTime, saving]);

  const validateConflicts = (): string | null => {
    const s = startTime;
    const e = endTime;
    const sameIndexConflict = existing.some((x) => x.slotIndex === slotIndex && (!initial || x.id !== initial.id));
    if (sameIndexConflict) return 'SlotIndex đã tồn tại';
    const overlapConflict = existing.some((x) => (!initial || x.id !== initial.id) && hasOverlap(s, e, x.startTime, x.endTime));
    if (overlapConflict) return 'Thời gian bị chồng chéo với slot khác';
    if (toSeconds(e) <= toSeconds(s)) return 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu';
    return null;
  };

  const handleSubmit = async () => {
    const conflict = validateConflicts();
    if (conflict) {
      setError(conflict);
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'create') {
        const payload: CreateSlotCommand = {
          startTime,
          endTime,
          slotIndex,
          label: label.trim(),
        };
        const id = await createSlot(payload);
        setSuccess('Tạo slot thành công');
        onSaved(id ?? null);
        onClose();
      } else if (mode === 'edit' && initial) {
        const payload: UpdateSlotCommand = {
          startTime,
          endTime,
          slotIndex,
          label: label.trim(),
        };
        await updateSlot(initial.id, payload);
        setSuccess('Cập nhật slot thành công');
        onSaved(initial.id);
        onClose();
      }
    } catch (e: any) {
      setError(e?.message ?? 'Đã xảy ra lỗi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'Thêm Slot' : 'Sửa Slot'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField label="Tên hiển thị" value={label} onChange={(e) => setLabel(e.target.value)} fullWidth required size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="SlotIndex" value={slotIndex} onChange={(e) => setSlotIndex(Number(e.target.value) as 1 | 2 | 3 | 4)} fullWidth required size="small">
              {[1, 2, 3, 4].map((i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Bắt đầu" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} fullWidth required size="small" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Kết thúc" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} fullWidth required size="small" />
          </Grid>
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
        <Button onClick={handleSubmit} disabled={!canSubmit} variant="contained" color="primary" startIcon={mode === 'create' ? <AddCircleOutlineIcon /> : <SaveIcon />}>{mode === 'create' ? 'Tạo' : 'Lưu'}</Button>
      </DialogActions>
    </Dialog>
  );
}
