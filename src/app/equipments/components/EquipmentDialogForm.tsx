'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem, Switch, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CreateEquipmentCommand, EquipmentStatus, GetAllLabRoomsQuery, LabRoomResponse, PagedResult, UpdateEquipmentCommand, EquipmentResponse } from '../../../lib/types';
import { createEquipment, getLabRooms, updateEquipment } from '../../../lib/services/api';

type Mode = 'create' | 'edit';

export default function EquipmentDialogForm({ open, onClose, mode, initial, onSaved }: { open: boolean; onClose: () => void; mode: Mode; initial?: EquipmentResponse | null; onSaved: (id?: string | null) => void }) {
  const [equipmentName, setEquipmentName] = useState('');
  const [description, setDescription] = useState('');
  const [labRoomId, setLabRoomId] = useState('');
  const [status, setStatus] = useState<EquipmentStatus>('Available');
  const [isAvailable, setIsAvailable] = useState(true);
  const [rooms, setRooms] = useState<LabRoomResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const rq: GetAllLabRoomsQuery = { searchPhrase: undefined, pageNumber: 1, pageSize: 30, sortBy: undefined, sortDirection: 'Ascending' };
    getLabRooms(rq)
      .then((res: PagedResult<LabRoomResponse>) => setRooms(res.items))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setEquipmentName(initial.equipmentName ?? '');
      setDescription(initial.description ?? '');
      setLabRoomId(initial.labRoomId ?? '');
      setStatus(initial.status ?? 'Available');
      setIsAvailable(initial.isAvailable);
    }
    if (mode === 'create') {
      setEquipmentName('');
      setDescription('');
      setLabRoomId('');
      setStatus('Available');
      setIsAvailable(true);
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const canSubmit = useMemo(() => {
    const okName = equipmentName.trim().length > 0 && equipmentName.trim().length <= 100;
    const okLab = labRoomId.trim().length > 0;
    return okName && okLab && !saving;
  }, [equipmentName, labRoomId, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'create') {
        const payload: CreateEquipmentCommand = {
          equipmentName: equipmentName.trim(),
          description: description.trim() || null,
          labRoomId,
        };
        const id = await createEquipment(payload);
        setSuccess('Tạo thiết bị thành công');
        onSaved(id ?? null);
        onClose();
      } else if (mode === 'edit' && initial) {
        const payload: UpdateEquipmentCommand = {
          equipmentName: equipmentName.trim(),
          description: description.trim() || null,
          isAvailable,
          labRoomId,
          status,
        };
        await updateEquipment(initial.id, payload);
        setSuccess('Cập nhật thiết bị thành công');
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
      <DialogTitle>{mode === 'create' ? 'Thêm thiết bị' : 'Sửa thiết bị'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField label="Tên thiết bị" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} fullWidth required size="small" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth size="small" multiline minRows={3} />
          </Grid>
          <Grid item xs={12}>
            <TextField select label="Phòng Lab" value={labRoomId} onChange={(e) => setLabRoomId(e.target.value)} fullWidth required size="small">
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.labName || r.id.slice(0, 8).toUpperCase()}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {mode === 'edit' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField select label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus)} fullWidth required size="small">
                  {(['Maintain', 'Available', 'Broken', 'Other'] as EquipmentStatus[]).map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel control={<Switch checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />} label="Có sẵn" />
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
        <Button onClick={onClose} startIcon={<CloseIcon />}>Hủy</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} variant="contained" color="primary" startIcon={mode === 'create' ? <AddCircleOutlineIcon /> : <SaveIcon />}>{mode === 'create' ? 'Tạo' : 'Lưu'}</Button>
      </DialogActions>
    </Dialog>
  );
}
