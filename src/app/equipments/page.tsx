"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
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
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTheme } from "@mui/material/styles";
import EquipmentDialogForm from "./components/EquipmentDialogForm";
import {
  deleteEquipment,
  getEquipments,
  getLabRooms,
  moveEquipment,
} from "../../lib/services/api";
import {
  EquipmentResponse,
  EquipmentStatus,
  GetAllEquipmentsQuery,
  GetAllLabRoomsQuery,
  LabRoomResponse,
  PagedResult,
} from "../../lib/types";
import EmptyState from "../../components/EmptyState";
import duotone from "../../components/icons/duotone";

function useDebounced<T>(value: T, delay: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function EquipmentsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [sortBy, setSortBy] = useState<
    "EquipmentName" | "Status" | "IsAvailable" | "LabRoomId" | undefined
  >("EquipmentName");
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | "All">(
    "All"
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "All" | "Available" | "Unavailable"
  >("All");
  const [data, setData] = useState<PagedResult<EquipmentResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<EquipmentResponse | null>(null);
  const [refreshSeq, setRefreshSeq] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [moveId, setMoveId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<LabRoomResponse[]>([]);
  const [moveTargetLab, setMoveTargetLab] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const rq: GetAllLabRoomsQuery = {
      searchPhrase: undefined,
      pageNumber: 1,
      pageSize: 30,
      sortBy: undefined,
      sortDirection: "Ascending",
    };
    getLabRooms(rq)
      .then((res) => setRooms(res.items))
      .catch(() => {});
  }, []);

  const query: GetAllEquipmentsQuery = useMemo(
    () => ({
      searchPhrase: debouncedSearch || undefined,
      pageNumber: page + 1,
      pageSize,
      sortBy,
      sortDirection,
    }),
    [debouncedSearch, page, pageSize, sortBy, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getEquipments(query)
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách thiết bị");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, refreshSeq]);

  const filteredItems = useMemo(() => {
    if (!data) return [] as EquipmentResponse[];
    return data.items.filter((e) => {
      const okStatus =
        statusFilter === "All" ? true : e.status === statusFilter;
      const okAvail =
        availabilityFilter === "All"
          ? true
          : availabilityFilter === "Available"
            ? e.isAvailable
            : !e.isAvailable;
      return okStatus && okAvail;
    });
  }, [data, statusFilter, availabilityFilter]);

  const handleSortClick = (
    field: "EquipmentName" | "Status" | "IsAvailable" | "LabRoomId"
  ) => {
    if (sortBy === field) {
      setSortDirection((prev) =>
        prev === "Ascending" ? "Descending" : "Ascending"
      );
    } else {
      setSortBy(field);
      setSortDirection("Ascending");
    }
  };

  const labName = (id: string) =>
    rooms.find((r) => r.id === id)?.labName ?? id.slice(0, 8).toUpperCase();

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "background.default" }}>
      <Stack
        justifyContent="space-between"
        sx={{ mb: 3 }}
        alignItems={{ xs: "flex-start", md: "center" }}
        direction={{ xs: "column", md: "row" }}
        spacing={1}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Quản lý thiết bị
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm thiết bị"
            aria-label="Tìm thiết bị"
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
          <TextField
            size="small"
            select
            label="Trạng thái"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as EquipmentStatus | "All");
              setPage(0);
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="All">Tất cả</MenuItem>
            {(
              ["Maintain", "Available", "Broken", "Other"] as EquipmentStatus[]
            ).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            label="Khả dụng"
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(
                e.target.value as "All" | "Available" | "Unavailable"
              );
              setPage(0);
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="All">Tất cả</MenuItem>
            <MenuItem value="Available">Có sẵn</MenuItem>
            <MenuItem value="Unavailable">Không sẵn</MenuItem>
          </TextField>
          <Button
            onClick={() => setCreateOpen(true)}
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm thiết bị
          </Button>
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
          {filteredItems.length === 0 ? (
            <Box sx={{ py: 6 }}>
              <EmptyState
                title="Chưa có dữ liệu"
                description="Hãy thêm thiết bị đầu tiên để bắt đầu"
                actionLabel="Thêm thiết bị"
                onAction={() => setCreateOpen(true)}
                Icon={duotone.TableList}
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
              <Table aria-label="Danh sách thiết bị">
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
                      <TableSortLabel
                        active={sortBy === "EquipmentName"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("EquipmentName")}
                      >
                        Tên thiết bị
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      <TableSortLabel
                        active={sortBy === "LabRoomId"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("LabRoomId")}
                      >
                        Phòng Lab
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      <TableSortLabel
                        active={sortBy === "Status"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("Status")}
                      >
                        Trạng thái
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      <TableSortLabel
                        active={sortBy === "IsAvailable"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("IsAvailable")}
                      >
                        Khả dụng
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((eq) => (
                    <TableRow
                      key={eq.id}
                      hover
                      sx={{ "& td": { borderBottom: "none" } }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {eq.equipmentName}
                        </Typography>
                        {eq.description && (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {eq.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{labName(eq.labRoomId)}</TableCell>
                      <TableCell>
                        <Chip
                          label={eq.status}
                          color={
                            eq.status === "Broken"
                              ? "error"
                              : eq.status === "Maintain"
                                ? "warning"
                                : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={eq.isAvailable ? "Có sẵn" : "Không sẵn"}
                          color={eq.isAvailable ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() => {
                            setEditing(eq);
                            setEditOpen(true);
                          }}
                          startIcon={<EditOutlinedIcon />}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            setMoveId(eq.id);
                            setMoveTargetLab(eq.labRoomId);
                          }}
                          startIcon={<DriveFileMoveOutlinedIcon />}
                        >
                          Chuyển phòng
                        </Button>
                        <Button
                          size="small"
                          sx={{ ml: 1 }}
                          color="error"
                          onClick={() => setConfirmId(eq.id)}
                          startIcon={<DeleteOutlineIcon />}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {filteredItems.map((eq) => (
                <Paper key={eq.id} sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {eq.equipmentName}
                    </Typography>
                    {eq.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {eq.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Phòng Lab:</Typography>
                      <Typography variant="body2">
                        {labName(eq.labRoomId)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Trạng thái:</Typography>
                      <Chip
                        label={eq.status}
                        color={
                          eq.status === "Broken"
                            ? "error"
                            : eq.status === "Maintain"
                              ? "warning"
                              : "success"
                        }
                        size="small"
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Khả dụng:</Typography>
                      <Chip
                        label={eq.isAvailable ? "Có sẵn" : "Không sẵn"}
                        color={eq.isAvailable ? "success" : "default"}
                        size="small"
                      />
                    </Stack>
                    <Box>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditing(eq);
                          setEditOpen(true);
                        }}
                        startIcon={<EditOutlinedIcon />}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setMoveId(eq.id);
                          setMoveTargetLab(eq.labRoomId);
                        }}
                        startIcon={<DriveFileMoveOutlinedIcon />}
                      >
                        Chuyển phòng
                      </Button>
                      <Button
                        size="small"
                        sx={{ ml: 1 }}
                        color="error"
                        onClick={() => setConfirmId(eq.id)}
                        startIcon={<DeleteOutlineIcon />}
                      >
                        Xóa
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <TablePagination
              component="div"
              count={data.totalItemsCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                const v = Number(e.target.value) as 5 | 10 | 15 | 30;
                setPageSize(v);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 15, 30]}
              labelRowsPerPage="Số dòng mỗi trang"
            />
          </Box>
        </>
      )}

      <EquipmentDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />

      {editing && (
        <EquipmentDialogForm
          open={editOpen}
          onClose={() => setEditOpen(false)}
          mode="edit"
          initial={editing}
          onSaved={() => {
            setRefreshSeq((s) => s + 1);
            setEditing(null);
          }}
        />
      )}

      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Xóa thiết bị?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Bạn có chắc chắn muốn xóa thiết bị này? Hành động này không thể hoàn
            tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)} startIcon={<CloseIcon />}>
            Hủy
          </Button>
          <Button
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={async () => {
              if (!confirmId) return;
              try {
                await deleteEquipment(confirmId);
                setRefreshSeq((s) => s + 1);
              } catch {}
              setConfirmId(null);
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!moveId}
        onClose={() => setMoveId(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Chuyển thiết bị sang phòng khác</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                select
                label="Phòng Lab mới"
                value={moveTargetLab}
                onChange={(e) => setMoveTargetLab(e.target.value)}
                fullWidth
                required
                size="small"
              >
                {rooms.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.labName || r.id.slice(0, 8).toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveId(null)} startIcon={<CloseIcon />}>
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<ArrowForwardIcon />}
            onClick={async () => {
              if (!moveId || !moveTargetLab) return;
              try {
                await moveEquipment(moveId, moveTargetLab);
                setRefreshSeq((s) => s + 1);
              } catch {}
              setMoveId(null);
            }}
          >
            Chuyển
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
