'use client';
import { Chip } from '@mui/material';

export function StatusChip({ active }: { active: boolean }) {
  return <Chip label={active ? 'Đang hoạt động' : 'Không hoạt động'} color={active ? 'success' : 'default'} size="small" />;
}
