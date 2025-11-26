"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CourseResponse } from "../../../lib/types";
import { getCourse } from "../../../lib/services/api";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getCourse(params.id)
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Không thể tải thông tin khóa học");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Button onClick={() => router.push("/courses")} startIcon={<ArrowBackIcon />}>Quay lại danh sách</Button>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {loading && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Skeleton variant="text" width={240} />
          <Skeleton variant="text" width={320} />
          <Skeleton variant="rectangular" height={120} />
        </Stack>
      )}
      {!loading && data && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{data.courseName}</Typography>
          <Typography variant="body1">Mã khóa học: {data.courseCode}</Typography>
          <Typography variant="body2" color="text.secondary">{data.description || "Không có mô tả"}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={data.isActive ? "Đang hoạt động" : "Ngừng hoạt động"} size="small" color={data.isActive ? "success" : "default"} />
            <Chip label={data.createdDate ? new Date(data.createdDate).toLocaleString() : "—"} size="small" />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
