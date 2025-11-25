"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Skeleton,
  Alert,
  Divider,
  Button,
  Card,
  CardContent,
  Avatar,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { LabRoomResponse } from "../../../lib/types";
import { getLabRoom } from "../../../lib/services/api";
import { useParams } from "next/navigation";
import { MdMeetingRoom, MdLocationOn, MdDevices } from "react-icons/md";

export default function LabRoomDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [room, setRoom] = useState<LabRoomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getLabRoom(id)
      .then(setRoom)
      .catch((e) => setError(e?.message ?? "Không thể tải phòng lab"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Chi tiết phòng Lab
        </Typography>
        <Button component={Link} href="/lab-rooms" variant="outlined">
          Quay lại
        </Button>
      </Stack>

      {/* Errors */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent>
            <Skeleton variant="text" height={40} width="40%" />
            <Skeleton variant="rounded" height={80} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {!loading && room && (
        <Stack spacing={3}>
          {/* Basic Info Card */}
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <MdMeetingRoom />
                  </Avatar>
                  <Stack>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {room.labName}
                    </Typography>
                    <Chip
                      label={
                        room.isActive ? "Đang hoạt động" : "Không hoạt động"
                      }
                      color={room.isActive ? "success" : "default"}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Stack>
                </Stack>

                <Divider />

                {/* Metadata */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MdLocationOn size={20} color="gray" />
                    <Typography variant="body2">
                      <strong>Vị trí:</strong> {room.location ?? "—"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <MdDevices size={20} color="gray" />
                    <Typography variant="body2">
                      <strong>Sức chứa:</strong> {room.maximumLimit ?? "—"}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Equipment Section */}
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thiết bị
                </Typography>
                <Divider />

                <Stack spacing={1.5}>
                  {(room.equipments ?? []).map((eq) => (
                    <Paper
                      key={eq.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Stack spacing={0.2}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {eq.equipmentName}
                        </Typography>
                        {eq.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ maxWidth: 500 }}
                          >
                            {eq.description}
                          </Typography>
                        )}
                      </Stack>

                      <Chip
                        label={eq.status}
                        size="small"
                        color={eq.isAvailable ? "success" : "default"}
                      />
                    </Paper>
                  ))}

                  {(!room.equipments || room.equipments.length === 0) && (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có thiết bị nào trong phòng lab này.
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  );
}
