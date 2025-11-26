"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import EmptyState from "../../components/EmptyState";
import duotone from "../../components/icons/duotone";
import {
  deleteEquipmentMaintainSchedule,
  getEquipmentMaintainSchedules,
} from "../../lib/services/api";
import {
  EquipmentMaintainScheduleResponse,
  EquimentpMaintainStatus,
  GetAllEquipmentMaintainSchedulesQuery,
} from "../../lib/types";
import EquipmentMaintainScheduleDialogForm from "./components/EquipmentMaintainScheduleDialogForm";

export default function EquipmentMaintainSchedulesPage() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [status, setStatus] = useState<EquimentpMaintainStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"StartTime" | "EndTime" | "EquimentpMaintainStatus" | undefined>("StartTime");
  const [sortDirection, setSortDirection] = useState<"Ascending" | "Descending">("Ascending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [data, setData] = useState<{ items: EquipmentMaintainScheduleResponse[]; totalItemsCount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EquipmentMaintainScheduleResponse | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllEquipmentMaintainSchedulesQuery = useMemo(
    () => ({
      searchPhrase: searchPhrase || undefined,
      status: status === "All" ? undefined : (status as EquimentpMaintainStatus),
      pageNumber: page + 1,
      pageSize,
      sortBy,
      sortDirection,
    }),
    [searchPhrase, status, page, pageSize, sortBy, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getEquipmentMaintainSchedules(query)
      .then((res) => {
        if (!active) return;
        setData({ items: res.items, totalItemsCount: res.totalItemsCount });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách lịch bảo trì");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, refreshSeq]);

  const filtered = useMemo(() => {
    const list = (data?.items ?? []).filter((x) => {
      const label = `${x.equipmentId ?? ""} ${x.description ?? ""}`.toLowerCase();
      return label.includes(searchPhrase.toLowerCase());
    });
    return list;
  }, [data, searchPhrase]);

  const handleSortClick = (field: "StartTime" | "EndTime" | "EquimentpMaintainStatus") => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "Ascending" ? "Descending" : "Ascending"));
    } else {
      setSortBy(field);
      setSortDirection("Ascending");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteEquipmentMaintainSchedule(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Xóa lịch bảo trì thất bại");
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "background.default" }}>
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} spacing={1} justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
          Lịch bảo trì thiết bị
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm"
            aria-label="Tìm kiếm"
            value={searchPhrase}
            onChange={(e) => {
              setSearchPhrase(e.target.value);
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
          <TextField select size="small" value={status} onChange={(e) => setStatus(e.target.value as any)} sx={{ minWidth: 180 }}>
            <MenuItem value={"All"}>Tất cả trạng thái</MenuItem>
            <MenuItem value={"NotYet"}>Chưa thực hiện</MenuItem>
            <MenuItem value={"Done"}>Hoàn thành</MenuItem>
          </TextField>
          <TextField select size="small" value={sortBy ?? "StartTime"} onChange={(e) => setSortBy(e.target.value as any)} sx={{ minWidth: 200 }}>
            <MenuItem value={"StartTime"}>Sắp xếp theo bắt đầu</MenuItem>
            <MenuItem value={"EndTime"}>Sắp xếp theo kết thúc</MenuItem>
            <MenuItem value={"EquimentpMaintainStatus"}>Sắp xếp theo trạng thái</MenuItem>
          </TextField>
          <TextField select size="small" value={sortDirection} onChange={(e) => setSortDirection(e.target.value as any)} sx={{ minWidth: 160 }}>
            <MenuItem value={"Ascending"}>Tăng dần</MenuItem>
            <MenuItem value={"Descending"}>Giảm dần</MenuItem>
          </TextField>
          <Button onClick={() => setCreateOpen(true)} variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>Thêm lịch</Button>
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
                title="Chưa có dữ liệu"
                description="Hãy thêm lịch bảo trì để bắt đầu"
                actionLabel="Thêm lịch"
                onAction={() => setCreateOpen(true)}
                Icon={duotone.Calender}
              />
            </Box>
          ) : !isMobile ? (
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Table aria-label="Danh sách lịch bảo trì">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.main", color: "white", "&:hover": { backgroundColor: "primary.main" } }}>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Thiết bị</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>
                      <TableSortLabel active={sortBy === "StartTime"} direction={sortDirection === "Ascending" ? "asc" : "desc"} onClick={() => handleSortClick("StartTime")}>
                        Bắt đầu
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>
                      <TableSortLabel active={sortBy === "EndTime"} direction={sortDirection === "Ascending" ? "asc" : "desc"} onClick={() => handleSortClick("EndTime")}>
                        Kết thúc
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Nhiều ngày</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Cả ngày</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Số slot</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>
                      <TableSortLabel active={sortBy === "EquimentpMaintainStatus"} direction={sortDirection === "Ascending" ? "asc" : "desc"} onClick={() => handleSortClick("EquimentpMaintainStatus")}>
                        Trạng thái
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Mô tả</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} hover sx={{ "& td": { borderBottom: "none" } }}>
                      <TableCell>
                        <Chip label={s.equipmentId.slice(0, 8).toUpperCase()} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{s.startTime ? new Date(s.startTime).toLocaleString() : "—"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{s.endTime ? new Date(s.endTime).toLocaleString() : "—"}</Typography>
                      </TableCell>
                      <TableCell>{s.isManyDay ? "Có" : "Không"}</TableCell>
                      <TableCell>{s.isAllDay ? "Có" : "Không"}</TableCell>
                      <TableCell>{s.numberOfSlot ?? "—"}</TableCell>
                      <TableCell>
                        {s.equimentpMaintainStatus === "Done" ? <Chip label="Hoàn thành" color="success" size="small" /> : <Chip label="Chưa" size="small" />}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{(s.description ?? "").length > 80 ? (s.description ?? "").slice(0, 80) + "…" : s.description}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button onClick={() => { setEditing(s); setEditOpen(true); }} size="small" sx={{ ml: 1 }} startIcon={<EditOutlinedIcon />}>Sửa</Button>
                        <Button onClick={() => setConfirmDelete({ open: true, id: s.id })} size="small" sx={{ ml: 1 }} color="error" startIcon={<DeleteOutlineIcon />}>Xóa</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={data.totalItemsCount}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) => {
                  setPageSize(Number(e.target.value) as 5 | 10 | 15 | 30);
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 15, 30]}
                labelRowsPerPage="Số dòng mỗi trang"
              />
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {filtered.map((s) => (
                <Card key={s.id} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={s.equipmentId.slice(0, 8).toUpperCase()} size="small" />
                        <Chip label={s.equimentpMaintainStatus ?? "NotYet"} size="small" color={s.equimentpMaintainStatus === "Done" ? "success" : "default"} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">BĐ: {s.startTime ? new Date(s.startTime).toLocaleString() : "—"}</Typography>
                      <Typography variant="body2" color="text.secondary">KT: {s.endTime ? new Date(s.endTime).toLocaleString() : "—"}</Typography>
                      <Typography variant="body2" color="text.secondary">Slot: {s.numberOfSlot ?? "—"}</Typography>
                      <Typography variant="body2" color="text.secondary">{(s.description ?? "").length > 120 ? (s.description ?? "").slice(0, 120) + "…" : s.description}</Typography>
                      <Box>
                        <Button onClick={() => { setEditing(s); setEditOpen(true); }} size="small" sx={{ ml: 0 }} startIcon={<EditOutlinedIcon />}>Sửa</Button>
                        <Button onClick={() => setConfirmDelete({ open: true, id: s.id })} size="small" sx={{ ml: 1 }} color="error" startIcon={<DeleteOutlineIcon />}>Xóa</Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}

      <EquipmentMaintainScheduleDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />
      <EquipmentMaintainScheduleDialogForm
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        mode="edit"
        initial={editing ?? undefined}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />

      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <DialogTitle>Xóa lịch bảo trì</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa lịch bảo trì này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })} startIcon={<CloseIcon />}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained" startIcon={<DeleteOutlineIcon />}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
