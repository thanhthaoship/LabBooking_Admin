"use client";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
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
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../components/EmptyState";
import duotone from "../../components/icons/duotone";
import {
  deleteSupport,
  getSupports,
  updateSupport,
} from "../../lib/services/api";
import {
  GetAllSupportsQuery,
  SupportsResponse,
  UpdateSupportCommand,
} from "../../lib/types";
import SupportDialogForm from "./components/SupportDialogForm";
import { Check, Close, Message } from "@mui/icons-material";

export default function SupportsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "Responded" | "Ignored" | "Pending"
  >("Pending");
  const [sortBy, setSortBy] = useState<"Title" | "CreatedDate" | undefined>(
    "Title"
  );
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [data, setData] = useState<{
    items: SupportsResponse[];
    totalItemsCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SupportsResponse | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllSupportsQuery = useMemo(
    () => ({
      searchPhrase: search || undefined,
      pageNumber: page + 1,
      pageSize,
      sortBy,
      sortDirection,
    }),
    [search, page, pageSize, sortBy, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getSupports(query)
      .then((res) => {
        if (!active) return;
        setData({ items: res.items, totalItemsCount: res.totalItemsCount });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách hỗ trợ");
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
      const okStatus =
        filterStatus === "Pending"
          ? x.status === "Pending"
          : filterStatus === "Ignored"
            ? x.status === "Ignored"
            : x.status === "Responded";
      const okLabel =
        x.title.toLowerCase().includes(search.toLowerCase()) ||
        x.content.toLowerCase().includes(search.toLowerCase());
      return okStatus && okLabel;
    });
    return list;
  }, [data, filterStatus, search]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      const payload: UpdateSupportCommand = {
        answer: "",
        status: 2,
      };
      await updateSupport(confirmDelete.id, payload);
      setConfirmDelete({ open: false, id: null });
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Cập nhật hỗ trợ thất bại");
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "background.default" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Quản lý hỗ trợ
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm hỗ trợ"
            aria-label="Tìm hỗ trợ"
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
            select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="Pending">Chưa trả lời</MenuItem>
            <MenuItem value="Responded">Đã trả lời</MenuItem>
            <MenuItem value="Ignored">Bỏ qua</MenuItem>
          </TextField>
          <Button
            onClick={() => setCreateOpen(true)}
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm hỗ trợ
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
                title="Chưa có dữ liệu"
                description="Hãy thêm hỗ trợ đầu tiên để bắt đầu"
                actionLabel="Thêm hỗ trợ"
                onAction={() => setCreateOpen(true)}
                Icon={duotone.Chat}
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
              <Table aria-label="Danh sách hỗ trợ">
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
                      Trả lời
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Người tạo
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow
                      key={s.id}
                      hover
                      sx={{ "& td": { borderBottom: "none" } }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {s.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {s.content.length > 80
                            ? s.content.slice(0, 80) + "…"
                            : s.content}
                        </Typography>
                      </TableCell>
                      <TableCell>{s.answer}</TableCell>
                      <TableCell>
                        {s.status === "Responded" ? (
                          <Chip
                            label="Đã trả lời"
                            color="success"
                            size="small"
                          />
                        ) : s.status === "Pending" ? (
                          <Chip
                            label="Chưa trả lời"
                            color="default"
                            size="small"
                          />
                        ) : (
                          <Chip label="Bỏ qua" color="error" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        {s.createdById.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => {
                            setEditing(s);
                            setEditOpen(true);
                          }}
                          size="small"
                          sx={{ ml: 1 }}
                          startIcon={<Message />}
                        >
                          Phản hồi
                        </Button>
                        <Button
                          onClick={() =>
                            setConfirmDelete({ open: true, id: s.id })
                          }
                          size="small"
                          sx={{ ml: 1 }}
                          color="error"
                          startIcon={<Close />}
                        >
                          Bỏ qua
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {filtered.map((s) => (
                <Card key={s.id} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.content.length > 120
                          ? s.content.slice(0, 120) + "…"
                          : s.content}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={s.answer ? "Đã trả lời" : "Chưa trả lời"}
                          size="small"
                          color={s.answer ? "success" : "default"}
                        />
                        <Chip
                          label={s.createdById.slice(0, 8).toUpperCase()}
                          size="small"
                        />
                      </Stack>
                      <Box>
                        <Button
                          onClick={() => {
                            setEditing(s);
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
                            setConfirmDelete({ open: true, id: s.id })
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
              ))}
            </Stack>
          )}
        </>
      )}

      <SupportDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />
      <SupportDialogForm
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
        <DialogTitle>Bỏ qua hỗ trợ</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn bỏ qua hỗ trợ này?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, id: null })}
            startIcon={<Close />}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            startIcon={<Check />}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
