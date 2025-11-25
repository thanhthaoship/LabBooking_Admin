"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { SlotResponse } from "../../lib/types";
import { deleteSlot, getSlots } from "../../lib/services/api";
import SlotDialogForm from "./components/SlotDialogForm";

function toSeconds(t: string): number {
  const parts = t.split(":").map((p) => Number(p));
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  return h * 3600 + m * 60 + s;
}

export default function SlotsPage() {
  const [search, setSearch] = useState("");
  const [filterIndex, setFilterIndex] = useState<number | "">("");
  const [data, setData] = useState<SlotResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<SlotResponse | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [refreshSeq, setRefreshSeq] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getSlots()
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách slot");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshSeq]);

  const filtered = useMemo(() => {
    const list = (data ?? []).filter((x) => {
      const okLabel = x.label.toLowerCase().includes(search.toLowerCase());
      const okIndex = filterIndex === "" ? true : x.slotIndex === filterIndex;
      return okLabel && okIndex;
    });
    return list
      .slice()
      .sort(
        (a, b) =>
          a.slotIndex - b.slotIndex ||
          toSeconds(a.startTime) - toSeconds(b.startTime)
      );
  }, [data, search, filterIndex]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteSlot(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      setRefreshSeq((s) => s + 1);
    } catch (e: any) {
      setError(e?.message ?? "Xóa slot thất bại");
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
          Cấu hình Slot
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm slot"
            aria-label="Tìm slot"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: 160, md: 240 }, bgcolor: "background.paper" }}
          />
          <TextField
            select
            size="small"
            value={filterIndex}
            onChange={(e) =>
              setFilterIndex(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {[1, 2, 3, 4].map((i) => (
              <MenuItem key={i} value={i}>{`Slot ${i}`}</MenuItem>
            ))}
          </TextField>
          <Button
            onClick={() => setCreateOpen(true)}
            variant="contained"
            color="primary"
          >
            Thêm Slot
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
          {!isMobile ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Table aria-label="Danh sách slot">
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
                      Tên hiển thị
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      SlotIndex
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Bắt đầu
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Kết thúc
                    </TableCell>
                    <TableCell
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((slot) => (
                    <TableRow
                      key={slot.id}
                      hover
                      sx={{ "& td": { borderBottom: "none" } }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {slot.label}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Slot ${slot.slotIndex}`}
                          size="small"
                          color="default"
                        />
                      </TableCell>
                      <TableCell>{slot.startTime}</TableCell>
                      <TableCell>{slot.endTime}</TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          href={`/slots/${slot.id}`}
                          size="small"
                        >
                          Xem
                        </Button>
                        <Button
                          onClick={() => {
                            setEditing(slot);
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
                            setConfirmDelete({ open: true, id: slot.id })
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
            </TableContainer>
          ) : (
            <Stack spacing={2}>
              {filtered.map((slot) => (
                <Card key={slot.id} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {slot.label}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">SlotIndex:</Typography>
                        <Chip label={`Slot ${slot.slotIndex}`} size="small" />
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">Bắt đầu:</Typography>
                        <Typography variant="body2">
                          {slot.startTime}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">Kết thúc:</Typography>
                        <Typography variant="body2">{slot.endTime}</Typography>
                      </Stack>
                      <Box>
                        <Button
                          component={Link}
                          href={`/slots/${slot.id}`}
                          size="small"
                        >
                          Xem
                        </Button>
                        <Button
                          onClick={() => {
                            setEditing(slot);
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
                            setConfirmDelete({ open: true, id: slot.id })
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

      <SlotDialogForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSaved={() => setRefreshSeq((s) => s + 1)}
        existing={data ?? []}
      />
      <SlotDialogForm
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        mode="edit"
        initial={editing ?? undefined}
        onSaved={() => setRefreshSeq((s) => s + 1)}
        existing={(data ?? []).filter((x) => !editing || x.id !== editing.id)}
      />

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xóa slot</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa slot này?</DialogContent>
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
