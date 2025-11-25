'use client';

import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Chip, Skeleton, Alert, Divider, Button } from '@mui/material';
import Link from 'next/link';
import { LabRoomResponse } from '../../../lib/types';
import { getLabRoom } from '../../../lib/services/api';
import { useParams } from 'next/navigation';

export default function LabRoomDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  const [room, setRoom] = useState<LabRoomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getLabRoom(id)
      .then(setRoom)
      .catch((e) => setError(e?.message ?? 'Không thể tải phòng lab'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chi tiết phòng Lab
        </Typography>
        <Button component={Link} href="/lab-rooms" variant="outlined">
          Quay lại
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {loading && <Skeleton variant="rounded" height={120} />}

      {!loading && room && (
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{room.labName}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={room.isActive ? 'Đang hoạt động' : 'Không hoạt động'} color={room.isActive ? 'success' : 'default'} />
            <Typography variant="body2">Sức chứa: {room.maximumLimit ?? '—'}</Typography>
            <Typography variant="body2">Vị trí: {room.location ?? '—'}</Typography>
          </Stack>
          <Divider />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thiết bị</Typography>
          <Stack spacing={1}>
            {(room.equipments ?? []).map((eq) => (
              <Stack key={eq.id} direction="row" spacing={2} alignItems="center">
                <Typography variant="body2">{eq.equipmentName}</Typography>
                <Typography variant="body2" color="text.secondary">{eq.description ?? ''}</Typography>
                <Chip label={eq.status} size="small" color={eq.isAvailable ? 'success' : 'default'} />
              </Stack>
            ))}
            {(!room.equipments || room.equipments.length === 0) && <Typography variant="body2">Chưa có thiết bị</Typography>}
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
