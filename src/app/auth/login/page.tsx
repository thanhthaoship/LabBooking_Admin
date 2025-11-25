"use client";

import {
  Alert,
  Box,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ArrowRightAlt, Lock, Person } from "@mui/icons-material";
import Image from "next/image";
import { useMemo, useState } from "react";
import { LoginUserCommand } from "../../../lib/types";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const { loginWithEmail } = useAuth();

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0 && !loading,
    [email, password, loading]
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: LoginUserCommand = {
        email: email.trim(),
        password: password.trim(),
      };
      const res = await loginWithEmail(payload);
      if (res?.accessToken) {
        const redirect = params.get("redirect") || "/";
        router.push(redirect);
      }
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? "Đăng nhập thất bại";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        width: "100vw",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Container>
        <Grid
          container
          spacing={0}
          alignItems="stretch"
          sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}
        >
          <Grid item xs={12} md={6} sx={{ bgcolor: "background.paper" }}>
            <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
              <Typography
                variant="h4"
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                LAB BOOKING
              </Typography>
              <Typography variant="body2" sx={{ mt: 3 }}>
                Chào mừng trở lại!
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                Đăng nhập
              </Typography>

              <Stack spacing={2.2} sx={{ mt: 3 }}>
                <TextField
                  label="Tên đăng nhập"
                  placeholder="admin@fpt.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {error && <Alert severity="error">{error}</Alert>}

                <LoadingButton
                  loading={loading}
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowRightAlt />}
                  sx={{ alignSelf: "flex-start", px: 3, borderRadius: 999 }}
                >
                  Đăng nhập
                </LoadingButton>
              </Stack>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ bgcolor: "#FFE8D8", position: "relative" }}
          >
            <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                FPT EDUCATION
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "primary.main", fontWeight: 800, mt: 1 }}
              >
                FPT UNIVERSITY
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "primary.main", mt: 0.5 }}
              >
                LAB BOOKING
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: { xs: 16, md: 40 },
                bottom: { xs: 16, md: 24 },
              }}
            >
              <Image
                src="/assets/images/illustrations/welcome.svg"
                alt="Illustration"
                width={320}
                height={320}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
