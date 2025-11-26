"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoomMaintainScheduleResponse } from "../../../lib/types";
import { getRoomMaintainSchedule } from "../../../lib/services/api";

export default function RoomMaintainScheduleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<RoomMaintainScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getRoomMaintainSchedule(params.id)
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải lịch bảo trì phòng");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Button onClick={() => router.push("/room-maintain-schedules")} startIcon={<ArrowBackIcon />}>Quay lại danh sách</Button>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {loading && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Skeleton variant="text" width={240} />
          <Skeleton variant="text" width={320} />
          <Skeleton variant="rectangular" height={120} />
        </Stack>
      )}
      {!loading && data && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={data.labRoomId.slice(0, 8).toUpperCase()} size="small" />
            <Chip label={data.roomMaintainStatus ?? "NotYet"} size="small" color={data.roomMaintainStatus === "Done" ? "success" : "default"} />
          </Stack>
          <Typography variant="body1">Bắt đầu: {data.startTime ? new Date(data.startTime).toLocaleString() : "—"}</Typography>
          <Typography variant="body1">Kết thúc: {data.endTime ? new Date(data.endTime).toLocaleString() : "—"}</Typography>
          <Typography variant="body1">Nhiều ngày: {data.isManyDay ? "Có" : "Không"}</Typography>
          <Typography variant="body1">Cả ngày: {data.isAllDay ? "Có" : "Không"}</Typography>
          <Typography variant="body1">Số slot: {data.numberOfSlot ?? "—"}</Typography>
          <Typography variant="body2" color="text.secondary">{data.description || "Không có mô tả"}</Typography>
        </Stack>
      )}
    </Box>
  );
}
