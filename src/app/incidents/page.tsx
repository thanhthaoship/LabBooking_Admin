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
import { useTheme } from "@mui/material/styles";
import {
  GetAllIncidentsQuery,
  IncidentsResponse,
  GetAllLabRoomsQuery,
  LabRoomResponse,
  PagedResult,
} from "../../lib/types";
import { getIncidents, getLabRooms } from "../../lib/services/api";
import EmptyState from "../../components/EmptyState";
import duotone from "../../components/icons/duotone";

export default function IncidentsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "" | "resolved" | "unresolved"
  >("");
  const [filterLab, setFilterLab] = useState<string | "">("");
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Descending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [data, setData] = useState<{
    items: IncidentsResponse[];
    totalItemsCount: number;
  } | null>(null);
  const [rooms, setRooms] = useState<LabRoomResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllIncidentsQuery = useMemo(
    () => ({
      searchPhrase: search || undefined,
      pageNumber: page + 1,
      pageSize,
      sortBy: "Description",
      sortDirection,
    }),
    [search, page, pageSize, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getIncidents(query)
      .then((res) => {
        if (!active) return;
        setData({ items: res.items, totalItemsCount: res.totalItemsCount });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách sự cố");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, refreshSeq]);

  useEffect(() => {
    const rq: GetAllLabRoomsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 30,
      sortBy: undefined,
      sortDirection: "Ascending",
    };
    getLabRooms(rq)
      .then((res: PagedResult<LabRoomResponse>) => setRooms(res.items))
      .catch(() => {});
  }, []);

  const roomMap = useMemo(() => {
    const m: Record<string, string> = {};
    rooms.forEach((r) => {
      m[r.id] = r.labName || r.id.slice(0, 8).toUpperCase();
    });
    return m;
  }, [rooms]);

  const filtered = useMemo(() => {
    const list = (data?.items ?? []).filter((x) => {
      const okStatus =
        filterStatus === ""
          ? true
          : filterStatus === "resolved"
            ? x.isResolved
            : !x.isResolved;
      const okLab = filterLab === "" ? true : x.labRoomId === filterLab;
      const okText =
        x.description.toLowerCase().includes(search.toLowerCase()) ||
        x.type.toLowerCase().includes(search.toLowerCase());
      return okStatus && okLab && okText;
    });
    return list;
  }, [data, filterStatus, filterLab, search]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "background.default" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Sự cố
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm sự cố"
            aria-label="Tìm sự cố"
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

      {loading && (
        <Stack spacing={2}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={64} />
          ))}
        </Stack>
      )}

      {!loading && data && (
        <>
          {filtered.length === 0 ? (
            <Box sx={{ py: 6 }}>
              <EmptyState
                title="Chưa có dữ liệu)"
                description="Không có sự cố nào"
                Icon={duotone.ElementHub}
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
              <Table aria-label="Danh sách sự cố">
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
                      Loại
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Mô tả
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Phòng
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Người báo cáo
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Thời gian
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Trạng thái
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((i) => {
                    const createdDisplay = new Date(
                      i.createdAt
                    ).toLocaleString();
                    return (
                      <TableRow
                        key={i.id}
                        hover
                        sx={{ "& td": { borderBottom: "none" } }}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {i.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {i.description.length > 100
                              ? i.description.slice(0, 100) + "…"
                              : i.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {roomMap[i.labRoomId] ??
                            i.labRoomId.slice(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {i.reportedById.slice(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell>{createdDisplay}</TableCell>
                        <TableCell>
                          <Chip
                            label={i.isResolved ? "Đã xử lý" : "Chưa xử lý"}
                            color={i.isResolved ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {filtered.map((i) => {
                const createdDisplay = new Date(i.createdAt).toLocaleString();
                return (
                  <Card key={i.id} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {i.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {i.description}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={
                              roomMap[i.labRoomId] ??
                              i.labRoomId.slice(0, 8).toUpperCase()
                            }
                            size="small"
                          />
                          <Chip
                            label={i.reportedById.slice(0, 8).toUpperCase()}
                            size="small"
                          />
                          <Chip label={createdDisplay} size="small" />
                          <Chip
                            label={i.isResolved ? "Đã xử lý" : "Chưa xử lý"}
                            size="small"
                            color={i.isResolved ? "success" : "default"}
                          />
                        </Stack>
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
