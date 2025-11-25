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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTheme } from "@mui/material/styles";
import {
  CreateUsagePolicyCommand,
  GetAllLabRoomsQuery,
  GetAllUsagePoliciesQuery,
  LabRoomResponse,
  PagedResult,
  UsagePolicyResponse,
} from "../../lib/types";
import {
  deleteUsagePolicy,
  getLabRooms,
  getUsagePolicies,
} from "../../lib/services/api";
import PolicyDialogForm from "./components/PolicyDialogForm";
import EmptyState from "../../components/EmptyState";
import duotone from "../../components/icons/duotone";

export default function PoliciesPage() {
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"" | "active" | "inactive">(
    ""
  );
  const [sortBy, setSortBy] = useState<"CreatedDate" | "Title" | undefined>(
    "CreatedDate"
  );
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Descending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [data, setData] = useState<{
    items: UsagePolicyResponse[];
    totalItemsCount: number;
  } | null>(null);
  const [rooms, setRooms] = useState<LabRoomResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<UsagePolicyResponse | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
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
      .then((res: PagedResult<LabRoomResponse>) => setRooms(res.items))
      .catch(() => {});
  }, []);

  const query: GetAllUsagePoliciesQuery = useMemo(
    () => ({
      searchPhrase: search || undefined,
      isActive: filterActive === "" ? undefined : filterActive === "active",
      pageNumber: page + 1,
      pageSize,
      sortBy,
      sortDirection,
    }),
    [search, filterActive, page, pageSize, sortBy, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getUsagePolicies(query)
      .then((res) => {
        if (!active) return;
        setData({ items: res.items, totalItemsCount: res.totalItemsCount });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách chính sách");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, refreshSeq]);

  const labName = (id?: string | null) => {
    if (!id) return "Tất cả";
    const r = rooms.find((x) => x.id === id);
    return r?.labName || (id ? id.slice(0, 8).toUpperCase() : "Tất cả");
  };

  const filtered = useMemo(() => {
    const list = (data?.items ?? []).filter((x) => {
      const okLabel =
        (x.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (x.description ?? "").toLowerCase().includes(search.toLowerCase());
      return okLabel;
    });
    return list;
  }, [data, search]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteUsagePolicy(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Xóa chính sách thất bại");
      setConfirmDelete({ open: false, id: null });
    }
  };

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
          Chính sách
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm chính sách"
            aria-label="Tìm chính sách"
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

          <Button
            onClick={() => setCreateOpen(true)}
            variant="contained"
            color="primary"
          >
            Thêm chính sách
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
          {filtered.length === 0 ? (
            <Box sx={{ py: 6 }}>
              <EmptyState
                title="Chưa có dữ liệu)"
                description="Hãy thêm chính sách đầu tiên để bắt đầu"
                actionLabel="Thêm chính sách"
                onAction={() => setCreateOpen(true)}
                Icon={duotone.SiteSetting}
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
              <Table aria-label="Danh sách chính sách">
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
                      Hiệu lực
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((p) => {
                    const effective = p.effectiveFrom
                      ? new Date(p.effectiveFrom).toLocaleString()
                      : "—";
                    const expire = p.expirationDate
                      ? new Date(p.expirationDate).toLocaleString()
                      : "—";
                    return (
                      <TableRow
                        key={p.id}
                        hover
                        sx={{ "& td": { borderBottom: "none" } }}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {p.title ?? "—"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {(p.description ?? "").length > 100
                              ? (p.description ?? "").slice(0, 100) + "…"
                              : (p.description ?? "")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {p.forAllLabRooms ? "Tất cả" : labName(p.labRoomId)}
                        </TableCell>
                        <TableCell>
                          {effective} → {expire}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              p.isActive ? "Đang hoạt động" : "Không hoạt động"
                            }
                            color={p.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() => {
                              setEditing(p);
                              setEditOpen(true);
                            }}
                            size="small"
                            sx={{ ml: 1 }}
                            startIcon={<EditOutlinedIcon />}
                          >
                            Sửa
                          </Button>
                          <Button
                            onClick={() =>
                              setConfirmDelete({ open: true, id: p.id })
                            }
                            size="small"
                            sx={{ ml: 1 }}
                            color="error"
                            startIcon={<DeleteOutlineIcon />}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {filtered.map((p) => {
                const effective = p.effectiveFrom
                  ? new Date(p.effectiveFrom).toLocaleString()
                  : "—";
                const expire = p.expirationDate
                  ? new Date(p.expirationDate).toLocaleString()
                  : "—";
                return (
                  <Card key={p.id} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {p.title ?? "—"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {p.description ?? ""}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={
                              p.forAllLabRooms ? "Tất cả" : labName(p.labRoomId)
                            }
                            size="small"
                          />
                          <Chip
                            label={`${effective} → ${expire}`}
                            size="small"
                          />
                          <Chip
                            label={
                              p.isActive ? "Đang hoạt động" : "Không hoạt động"
                            }
                            size="small"
                            color={p.isActive ? "success" : "default"}
                          />
                        </Stack>
                        <Box>
                          <Button
                            onClick={() => {
                              setEditing(p);
                              setEditOpen(true);
                            }}
                            size="small"
                            sx={{ ml: 0 }}
                            startIcon={<EditOutlinedIcon />}
                          >
                            Sửa
                          </Button>
                          <Button
                            onClick={() =>
                              setConfirmDelete({ open: true, id: p.id })
                            }
                            size="small"
                            sx={{ ml: 1 }}
                            color="error"
                            startIcon={<DeleteOutlineIcon />}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </>
      )}

      <PolicyDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />
      <PolicyDialogForm
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        mode="edit"
        initial={editing ?? undefined}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xóa chính sách</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa chính sách này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
