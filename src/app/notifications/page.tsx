"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  Skeleton,
  Alert,
  useMediaQuery,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useTheme } from "@mui/material/styles";
import {
  GetAllNotificationsQuery,
  NotificationsResponse,
} from "../../lib/types";
import {
  getNotifications,
  markNotificationAsRead,
  sendTestNotificationToSelf,
} from "../../lib/services/api";
import EmptyState from "../../components/EmptyState";
import duotone from "../../components/icons/duotone";

function getPriorityFromPayload(
  payload?: string | null
): "high" | "medium" | "low" | "normal" {
  if (!payload) return "normal";
  try {
    const data = JSON.parse(payload);
    const p = (data?.priority as string | undefined)?.toLowerCase();
    if (p === "high") return "high";
    if (p === "medium") return "medium";
    if (p === "low") return "low";
  } catch {}
  return "normal";
}

function priorityChipColor(p: "high" | "medium" | "low" | "normal") {
  if (p === "high") return "error" as const;
  if (p === "medium") return "warning" as const;
  if (p === "low") return "default" as const;
  return "default" as const;
}

export default function NotificationsPage() {
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"" | "unread" | "read">("");
  const [sortBy, setSortBy] = useState<"CreatedAt" | "Title" | undefined>(
    "CreatedAt"
  );
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Descending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [data, setData] = useState<{
    items: NotificationsResponse[];
    totalItemsCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllNotificationsQuery = useMemo(
    () => ({
      searchPhrase: search || undefined,
      isRead: filterRead === "" ? undefined : filterRead === "read",
      pageNumber: page + 1,
      pageSize,
      sortBy,
      sortDirection,
    }),
    [search, filterRead, page, pageSize, sortBy, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setInfo(null);
    getNotifications(query)
      .then((res) => {
        if (!active) return;
        setData({ items: res.items, totalItemsCount: res.totalItemsCount });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải thông báo");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, refreshSeq]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Không thể đánh dấu đã đọc");
    }
  };

  const handleSendTest = async () => {
    try {
      const msg = await sendTestNotificationToSelf();
      setInfo(msg);
    } catch (e: any) {
      setError(e?.message ?? "Không thể gửi thông báo test");
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "background.default" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
        spacing={1}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Thông báo
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <TextField
            size="small"
            placeholder="Tìm thông báo"
            aria-label="Tìm thông báo"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: 180, md: 280 }, bgcolor: "background.paper" }}
          />
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {info && (
        <Alert severity="success" sx={{ mt: 1 }}>
          {info}
        </Alert>
      )}

      {loading && (
        <Stack spacing={2}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={64} />
          ))}
        </Stack>
      )}

      {!loading && data && (
        <>
          {data.items.length === 0 ? (
            <Box sx={{ py: 6 }}>
              <EmptyState
                title="Chưa có dữ liệu"
                description="Không có thông báo nào"
                Icon={duotone.Session}
              />
            </Box>
          ) : !isMobile ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Table aria-label="Danh sách thông báo">
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { backgroundColor: "primary.main" },
                    }}
                  >
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Tiêu đề
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Nội dung
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Thời gian
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Mức ưu tiên
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((n) => {
                    const priority = getPriorityFromPayload(n.dataPayload);
                    const createdDisplay = new Date(
                      n.createdAt
                    ).toLocaleString();
                    return (
                      <TableRow
                        key={n.id}
                        hover
                        sx={{ "& td": { borderBottom: "none" } }}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {!n.isRead && (
                              <Chip label="Mới" color="primary" size="small" />
                            )}
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {n.title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {n.message.length > 100
                              ? n.message.slice(0, 100) + "…"
                              : n.message}
                          </Typography>
                        </TableCell>
                        <TableCell>{createdDisplay}</TableCell>
                        <TableCell>
                          <Chip
                            label={priority.toUpperCase()}
                            size="small"
                            color={priorityChipColor(priority)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {!n.isRead && (
                            <Button
                              onClick={() => handleMarkRead(n.id)}
                              size="small"
                              startIcon={<MarkEmailReadIcon />}
                            >
                              Đánh dấu đã đọc
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {data.items.map((n) => {
                const priority = getPriorityFromPayload(n.dataPayload);
                const createdDisplay = new Date(n.createdAt).toLocaleString();
                return (
                  <Card key={n.id} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {!n.isRead && (
                            <Chip label="Mới" color="primary" size="small" />
                          )}
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {n.title}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {n.message}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={createdDisplay} size="small" />
                          <Chip
                            label={priority.toUpperCase()}
                            size="small"
                            color={priorityChipColor(priority)}
                          />
                        </Stack>
                        {!n.isRead && (
                          <Box>
                            <Button
                              onClick={() => handleMarkRead(n.id)}
                              size="small"
                              startIcon={<MarkEmailReadIcon />}
                            >
                              Đánh dấu đã đọc
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
