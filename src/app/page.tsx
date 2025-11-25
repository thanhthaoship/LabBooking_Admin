"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import duotone from "@components/icons/duotone";
import { useAuth } from "@contexts/AuthContext";
import {
  getEquipments,
  getIncidents,
  getLabRooms,
  getNotifications,
  getSlots,
} from "@/lib/services/api";
import {
  EquipmentResponse,
  GetAllEquipmentsQuery,
  GetAllIncidentsQuery,
  GetAllLabRoomsQuery,
  GetAllNotificationsQuery,
  LabRoomResponse,
  NotificationsResponse,
  IncidentsResponse,
  PagedResult,
  SlotResponse,
} from "@/lib/types";

type StatItem = {
  label: string;
  value: number | string;
  href: string;
  Icon: React.ComponentType;
  color: "primary" | "success" | "warning" | "info" | "error" | "default";
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [labRooms, setLabRooms] = useState<PagedResult<LabRoomResponse> | null>(
    null
  );
  const [equipments, setEquipments] =
    useState<PagedResult<EquipmentResponse> | null>(null);
  const [slots, setSlots] = useState<SlotResponse[] | null>(null);
  const [notifications, setNotifications] =
    useState<PagedResult<NotificationsResponse> | null>(null);
  const [incidents, setIncidents] =
    useState<PagedResult<IncidentsResponse> | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const labQuery: GetAllLabRoomsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 5,
      sortBy: "CreatedDate",
      sortDirection: "Descending",
    };
    const eqQuery: GetAllEquipmentsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 5,
      sortBy: "EquipmentName",
      sortDirection: "Ascending",
    };
    const notiQuery: GetAllNotificationsQuery = {
      searchPhrase: undefined,
      isRead: false,
      pageNumber: 1,
      pageSize: 5,
      sortBy: "CreatedAt",
      sortDirection: "Descending",
    };
    const incQuery: GetAllIncidentsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 5,
      sortBy: "Description",
      sortDirection: "Descending",
    };

    Promise.all([
      getLabRooms(labQuery),
      getEquipments(eqQuery),
      getSlots(),
      getNotifications(notiQuery),
      getIncidents(incQuery),
    ])
      .then(([labs, eqs, sl, notis, inc]) => {
        setLabRooms(labs);
        setEquipments(eqs);
        setSlots(sl);
        setNotifications(notis);
        setIncidents(inc);
      })
      .catch((e) => setError(e?.message ?? "Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  const stats: StatItem[] = useMemo(() => {
    return [
      {
        label: "Phòng Lab",
        value: labRooms?.totalItemsCount ?? 0,
        href: "/lab-rooms",
        Icon: duotone.TableList,
        color: "primary",
      },
      {
        label: "Thiết bị",
        value: equipments?.totalItemsCount ?? 0,
        href: "/equipments",
        Icon: duotone.DataTable,
        color: "success",
      },
      {
        label: "Thông báo chưa đọc",
        value: notifications?.totalItemsCount ?? 0,
        href: "/notifications",
        Icon: duotone.TodoList,
        color: "warning",
      },
      {
        label: "Slot cấu hình",
        value: slots?.length ?? 0,
        href: "/slots",
        Icon: duotone.Calender,
        color: "info",
      },
    ];
  }, [labRooms, equipments, notifications, slots]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="overline"
                  sx={{ color: "primary.main", fontWeight: 700 }}
                >
                  LAB BOOKING
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Xin chào {user?.userName || user?.email || ""}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Tổng quan hệ thống và tác vụ nhanh
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                <Button
                  component={Link}
                  href="/lab-rooms"
                  variant="outlined"
                  startIcon={<duotone.TableList />}
                >
                  Phòng Lab
                </Button>
                <Button
                  component={Link}
                  href="/equipments"
                  variant="outlined"
                  startIcon={<duotone.DataTable />}
                >
                  Thiết bị
                </Button>
                <Button
                  component={Link}
                  href="/supports"
                  variant="outlined"
                  startIcon={<duotone.TodoList />}
                >
                  Hỗ trợ
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {error && <Alert severity="error">{error}</Alert>}

        <Stack gap={2}>
          <Grid container spacing={2}>
            {stats.map((s, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: `${s.color}.main`,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        color: `${s.color}.contrastText`,
                      }}
                    >
                      <s.Icon />
                    </Box>
                    <Stack>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {s.label}
                      </Typography>
                      {loading ? (
                        <Skeleton variant="text" width={60} />
                      ) : (
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {s.value}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                  <Button
                    component={Link}
                    href={s.href}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Xem chi tiết
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Thông báo gần đây
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {loading ? (
                    <Stack spacing={1}>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={24} />
                    </Stack>
                  ) : notifications && notifications.items.length > 0 ? (
                    <Stack spacing={1}>
                      {notifications.items.map((n) => (
                        <Stack
                          key={n.id}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ py: 0.5 }}
                        >
                          <Chip
                            size="small"
                            label={n.isRead ? "Đã đọc" : "Mới"}
                            color={n.isRead ? "default" : "warning"}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {n.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {new Date(n.createdAt).toLocaleString()}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Không có thông báo
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Sự cố gần đây
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {loading ? (
                    <Stack spacing={1}>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" height={24} />
                    </Stack>
                  ) : incidents && incidents.items.length > 0 ? (
                    <Stack spacing={1}>
                      {incidents.items.map((i) => (
                        <Stack
                          key={i.id}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ py: 0.5 }}
                        >
                          <Chip
                            size="small"
                            label={i.isResolved ? "Đã xử lý" : "Đang mở"}
                            color={i.isResolved ? "success" : "error"}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {i.type}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {i.description}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Không có sự cố
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
}
