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
  TableSortLabel,
  TablePagination,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import {
  GetAllLabRoomsQuery,
  LabRoomResponse,
  PagedResult,
} from "../../lib/types";
import { getLabRooms } from "../../lib/services/api";

function useDebounced<T>(value: T, delay: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function LabRoomsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<5 | 10 | 15 | 30>(10);
  const [sortBy, setSortBy] = useState<
    "LabName" | "Location" | "CreatedDate" | undefined
  >("LabName");
  const [sortDirection, setSortDirection] = useState<
    "Ascending" | "Descending"
  >("Ascending");
  const [data, setData] = useState<PagedResult<LabRoomResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const query: GetAllLabRoomsQuery = useMemo(
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
    getLabRooms(query)
      .then((res) => {
        if (!active) return;

        console.log("res", res);
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải danh sách phòng lab");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query]);

  const handleSortClick = (field: "LabName" | "Location" | "CreatedDate") => {
    if (sortBy === field) {
      setSortDirection((prev) =>
        prev === "Ascending" ? "Descending" : "Ascending"
      );
    } else {
      setSortBy(field);
      setSortDirection("Ascending");
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
          Quản lý phòng Lab
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm phòng lab"
            aria-label="Tìm phòng lab"
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
            component={Link}
            href="/lab-rooms/create"
            variant="contained"
            color="primary"
          >
            Thêm phòng Lab
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
              <Table aria-label="Danh sách phòng lab">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.main", color: "black" }}>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    >
                      <TableSortLabel
                        active={sortBy === "LabName"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("LabName")}
                        sx={{
                          color: "secondary.contrastText",
                          "& .MuiTableSortLabel-icon": {
                            color: "primary.contrastText",
                          },
                        }}
                      >
                        Tên phòng
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    >
                      Mã phòng
                    </TableCell>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    >
                      Sức chứa
                    </TableCell>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    >
                      <TableSortLabel
                        active={sortBy === "CreatedDate"}
                        direction={
                          sortDirection === "Ascending" ? "asc" : "desc"
                        }
                        onClick={() => handleSortClick("CreatedDate")}
                        sx={{
                          color: "secondary.contrastText",
                          "& .MuiTableSortLabel-icon": {
                            color: "secondary.contrastText",
                          },
                        }}
                      >
                        Trạng thái
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    >
                      Người quản lý
                    </TableCell>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    >
                      Thiết bị
                    </TableCell>
                    <TableCell
                      sx={{ color: "secondary.contrastText", fontWeight: 600 }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((room) => {
                    const equipmentCount = room.equipments?.length ?? 0;
                    const code = room.id.slice(0, 8).toUpperCase();
                    const managerDisplay = room.mainManagerId
                      ? room.mainManagerId.slice(0, 8).toUpperCase()
                      : "—";
                    return (
                      <TableRow
                        key={room.id}
                        hover
                        sx={{ "& td": { borderBottom: "none" } }}
                      >
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {room.labName}
                          </Typography>
                        </TableCell>
                        <TableCell>{code}</TableCell>
                        <TableCell>{room.maximumLimit ?? "—"}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              room.isActive
                                ? "Đang hoạt động"
                                : "Không hoạt động"
                            }
                            color={room.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{managerDisplay}</TableCell>
                        <TableCell>{equipmentCount}</TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            href={`/lab-rooms/${room.id}`}
                            size="small"
                          >
                            Xem
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
              {data.items.map((room) => {
                const equipmentCount = room.equipments?.length ?? 0;
                const code = room.id.slice(0, 8).toUpperCase();
                const managerDisplay = room.mainManagerId
                  ? room.mainManagerId.slice(0, 8).toUpperCase()
                  : "—";
                return (
                  <Card key={room.id} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {room.labName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">Mã phòng:</Typography>
                          <Typography variant="body2">{code}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">Sức chứa:</Typography>
                          <Typography variant="body2">
                            {room.maximumLimit ?? "—"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">Trạng thái:</Typography>
                          <Chip
                            label={
                              room.isActive
                                ? "Đang hoạt động"
                                : "Không hoạt động"
                            }
                            color={room.isActive ? "success" : "default"}
                            size="small"
                          />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">
                            Người quản lý:
                          </Typography>
                          <Typography variant="body2">
                            {managerDisplay}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">Thiết bị:</Typography>
                          <Typography variant="body2">
                            {equipmentCount}
                          </Typography>
                        </Stack>
                        <Box>
                          <Button
                            component={Link}
                            href={`/lab-rooms/${room.id}`}
                            size="small"
                          >
                            Xem
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
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
    </Box>
  );
}
