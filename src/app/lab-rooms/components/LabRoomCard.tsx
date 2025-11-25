'use client';
import { Card, CardContent, Stack, Typography, Chip, Box, Button } from '@mui/material';
import Link from 'next/link';
import { LabRoomResponse } from '../../../lib/types';

export function LabRoomCard({ room }: { room: LabRoomResponse }) {
  const equipmentCount = room.equipments?.length ?? 0;
  const code = room.id.slice(0, 8).toUpperCase();
  const managerDisplay = room.mainManagerId ? room.mainManagerId.slice(0, 8).toUpperCase() : '—';
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{room.labName}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Mã phòng:</Typography>
            <Typography variant="body2">{code}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Sức chứa:</Typography>
            <Typography variant="body2">{room.maximumLimit ?? '—'}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Trạng thái:</Typography>
            <Chip label={room.isActive ? 'Đang hoạt động' : 'Không hoạt động'} color={room.isActive ? 'success' : 'default'} size="small" />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Người quản lý:</Typography>
            <Typography variant="body2">{managerDisplay}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Thiết bị:</Typography>
            <Typography variant="body2">{equipmentCount}</Typography>
          </Stack>
          <Box>
            <Button component={Link} href={`/lab-rooms/${room.id}`} size="small">Xem</Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
