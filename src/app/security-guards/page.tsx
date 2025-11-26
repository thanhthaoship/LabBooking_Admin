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
  Paper,
  Skeleton,
  Stack,
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
} from "../../lib/services/api";
import { SecurityGuardResponse } from "../../lib/types";
import SecurityGuardDialogForm from "./components/SecurityGuardDialogForm";

export default function SecurityGuardsPage() {
  const [searchId, setSearchId] = useState("");
  const [data, setData] = useState<SecurityGuardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const canSearch = useMemo(() => searchId.trim().length > 0, [searchId]);

  useEffect(() => {
    if (!canSearch) return;
    let active = true;
    setLoading(true);
    setError(null);
    getSecurityGuard(searchId.trim())
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setData(null);
        setError(e?.message ?? "Không thể tải thông tin bảo vệ");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [canSearch, searchId, refreshSeq]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteSecurityGuard(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      setData(null);
      setSearchId("");
    } catch (e: any) {
      setError(e?.message ?? "Xóa bảo vệ thất bại");
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "background.default" }}>
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} spacing={1} justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
          Quản lý bảo vệ
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
          <TextField
            size="small"
            placeholder="Nhập ID bảo vệ"
            aria-label="Tìm bảo vệ theo ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: 180, md: 320 }, bgcolor: "background.paper" }}
          />
          <Button onClick={() => setCreateOpen(true)} variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>Thêm bảo vệ</Button>
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

      {!loading && !data && (
        <Box sx={{ py: 6 }}>
          <EmptyState
            title="Chưa có dữ liệu"
            description="Tìm bảo vệ theo ID hoặc tạo mới"
            actionLabel="Thêm bảo vệ"
            onAction={() => setCreateOpen(true)}
            Icon={duotone.UserTie}
          />
        </Box>
      )}

      {!loading && data && (
        <Card component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <CardContent>
            <Stack spacing={2} direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{data.userName}</Typography>
                <Typography variant="body2" color="text.secondary">Email: {data.email}</Typography>
                <Typography variant="body2" color="text.secondary">SĐT: {data.phoneNumber ?? "—"}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label={data.id} size="small" />
              </Stack>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <Button onClick={() => setEditOpen(true)} size="small" sx={{ ml: 0 }} startIcon={<EditOutlinedIcon />}>Sửa</Button>
              <Button onClick={() => setConfirmDelete({ open: true, id: data.id })} size="small" sx={{ ml: 1 }} color="error" startIcon={<DeleteOutlineIcon />}>Xóa</Button>
            </Box>
          </CardContent>
        </Card>
      )}

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

      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <DialogTitle>Xóa bảo vệ</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa bảo vệ này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })} startIcon={<CloseIcon />}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained" startIcon={<DeleteOutlineIcon />}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
