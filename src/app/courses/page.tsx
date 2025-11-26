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
  TableRow,
  TablePagination,
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
import { deleteCourse, getCourses } from "../../lib/services/api";
import { CourseResponse, GetAllCoursesQuery } from "../../lib/types";
import CourseDialogForm from "./components/CourseDialogForm";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"CourseName" | "CourseCode" | undefined>(
    "CourseName"
  );
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [data, setData] = useState<{
    items: CourseResponse[];
    totalItemsCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CourseResponse | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllCoursesQuery = useMemo(
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
    getCourses(query)
      .then((res) => {
        if (!active) return;
        setData({ items: res.items, totalItemsCount: res.totalItemsCount });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách khóa học");
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
      const label = `${x.courseCode ?? ""} ${x.courseName ?? ""}`.toLowerCase();
      return label.includes(search.toLowerCase());
    });
    return list;
  }, [data, search]);

  const handleSortClick = (field: "CourseName" | "CourseCode") => {
    if (sortBy === field) {
      setSortDirection((prev) =>
        prev === "Ascending" ? "Descending" : "Ascending"
      );
    } else {
      setSortBy(field);
      setSortDirection("Ascending");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteCourse(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Xóa khóa học thất bại");
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
          Quản lý khóa học
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm khóa học"
            aria-label="Tìm khóa học"
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
            value={sortBy ?? "CourseName"}
            onChange={(e) => setSortBy(e.target.value as any)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={"CourseName"}>Sắp xếp theo tên</MenuItem>
            <MenuItem value={"CourseCode"}>Sắp xếp theo mã</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as any)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value={"Ascending"}>Tăng dần</MenuItem>
            <MenuItem value={"Descending"}>Giảm dần</MenuItem>
          </TextField>
          <Button
            onClick={() => setCreateOpen(true)}
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm khóa học
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
                description="Hãy thêm khóa học đầu tiên để bắt đầu"
                actionLabel="Thêm khóa học"
                onAction={() => setCreateOpen(true)}
                Icon={duotone.DataTable}
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
              <Table aria-label="Danh sách khóa học">
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
                        active={sortBy === "CourseCode"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("CourseCode")}
                      >
                        Mã khóa học
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      <TableSortLabel
                        active={sortBy === "CourseName"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("CourseName")}
                      >
                        Tên khóa học
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Mô tả
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Ngày tạo
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
                  {filtered.map((c) => (
                    <TableRow
                      key={c.id}
                      hover
                      sx={{ "& td": { borderBottom: "none" } }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {c.courseCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{c.courseName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {(c.description ?? "").length > 80
                            ? (c.description ?? "").slice(0, 80) + "…"
                            : c.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {c.createdDate
                            ? new Date(c.createdDate).toLocaleString()
                            : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {c.isActive ? (
                          <Chip
                            label="Đang hoạt động"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip label="Ngừng hoạt động" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => {
                            setEditing(c);
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
                            setConfirmDelete({ open: true, id: c.id })
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
              {filtered.map((c) => (
                <Card key={c.id} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {c.courseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mã: {c.courseCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(c.description ?? "").length > 120
                          ? (c.description ?? "").slice(0, 120) + "…"
                          : c.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={
                            c.isActive ? "Đang hoạt động" : "Ngừng hoạt động"
                          }
                          size="small"
                          color={c.isActive ? "success" : "default"}
                        />
                      </Stack>
                      <Box>
                        <Button
                          onClick={() => {
                            setEditing(c);
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
                            setConfirmDelete({ open: true, id: c.id })
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

      <CourseDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />
      <CourseDialogForm
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
        <DialogTitle>Xóa khóa học</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa khóa học này?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, id: null })}
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteOutlineIcon />}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
