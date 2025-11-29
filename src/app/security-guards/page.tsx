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
  deleteSecurityGuard,
  getSecurityGuard,
  getUsers,
} from "../../lib/services/api";
import {
  SecurityGuardResponse,
  GetAllUsersQuery,
  UserResponse,
} from "../../lib/types";
import SecurityGuardDialogForm from "./components/SecurityGuardDialogForm";

export default function SecurityGuardsPage() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [sortBy, setSortBy] = useState<
    "UserName" | "Email" | "Major" | "RegistrationDate" | undefined
  >("UserName");
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30 | 50>(10);
  const [usersData, setUsersData] = useState<{
    items: UserResponse[];
    totalItemsCount: number;
  } | null>(null);
  const [data, setData] = useState<SecurityGuardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllUsersQuery = useMemo(
    () => ({
      searchPhrase: searchPhrase || undefined,
      roleName: "SecurityGuard",
      pageNumber: page + 1,
      pageSize,
      sortBy,
      sortDirection,
    }),
    [searchPhrase, page, pageSize, sortBy, sortDirection]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getUsers(query)
      .then((res) => {
        if (!active) return;
        setUsersData({
          items: res.items,
          totalItemsCount: res.totalItemsCount,
        });
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách bảo vệ");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, refreshSeq]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteSecurityGuard(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Xóa bảo vệ thất bại");
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
          Quản lý bảo vệ
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <TextField
            size="small"
            placeholder="Tìm kiếm bảo vệ"
            aria-label="Tìm kiếm bảo vệ"
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
            sx={{ minWidth: { xs: 180, md: 320 }, bgcolor: "background.paper" }}
          />
          <TextField
            select
            size="small"
            value={sortBy ?? "UserName"}
            onChange={(e) => setSortBy(e.target.value as any)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={"UserName"}>Sắp xếp theo tên</MenuItem>
            <MenuItem value={"Email"}>Sắp xếp theo email</MenuItem>
            <MenuItem value={"RegistrationDate"}>Theo ngày đăng ký</MenuItem>
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
            Thêm bảo vệ
          </Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={64} />
          ))}
        </Stack>
      )}

      {!loading && usersData && usersData.items.length === 0 && (
        <Box sx={{ py: 6 }}>
          <EmptyState
            title="Chưa có dữ liệu"
            description="Hãy thêm bảo vệ để bắt đầu"
            actionLabel="Thêm bảo vệ"
            onAction={() => setCreateOpen(true)}
            Icon={duotone.UserTie}
          />
        </Box>
      )}

      {!loading &&
        usersData &&
        usersData.items.length > 0 &&
        (!isMobile ? (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Table aria-label="Danh sách bảo vệ">
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
                    Tên
                  </TableCell>
                  <TableCell
                    sx={{ color: "primary.contrastText", fontWeight: 600 }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{ color: "primary.contrastText", fontWeight: 600 }}
                  >
                    SĐT
                  </TableCell>
                  <TableCell
                    sx={{ color: "primary.contrastText", fontWeight: 600 }}
                  >
                    Mã
                  </TableCell>
                  <TableCell
                    sx={{ color: "primary.contrastText", fontWeight: 600 }}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {usersData.items.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{ "& td": { borderBottom: "none" } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {u.userName ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {u.email ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {u.phoneNumber ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={u.id} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => {
                          setData({
                            id: u.id,
                            email: u.email ?? "",
                            userName: u.userName ?? "",
                            phoneNumber: u.phoneNumber ?? null,
                          });
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
                          setConfirmDelete({ open: true, id: u.id })
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
              count={usersData.totalItemsCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(Number(e.target.value) as 5 | 10 | 15 | 30 | 50);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 15, 30, 50]}
              labelRowsPerPage="Số dòng mỗi trang"
            />
          </TableContainer>
        ) : (
          <Stack spacing={2}>
            {usersData.items.map((u) => (
              <Card key={u.id} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {u.userName ?? "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {u.email ?? "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      SĐT: {u.phoneNumber ?? "—"}
                    </Typography>
                    <Chip label={u.id} size="small" />
                    <Box>
                      <Button
                        onClick={() => {
                          setData({
                            id: u.id,
                            email: u.email ?? "",
                            userName: u.userName ?? "",
                            phoneNumber: u.phoneNumber ?? null,
                          });
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
                          setConfirmDelete({ open: true, id: u.id })
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
        ))}

      <SecurityGuardDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />
      <SecurityGuardDialogForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initial={data ?? undefined}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xóa bảo vệ</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa bảo vệ này?</DialogContent>
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
