"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  CreateSecurityGuardCommand,
  SecurityGuardResponse,
  UpdateSecurityGuardCommand,
} from "../../../lib/types";
import {
  createSecurityGuard,
  updateSecurityGuard,
} from "../../../lib/services/api";

type Mode = "create" | "edit";

export default function SecurityGuardDialogForm({
  open,
  onClose,
  mode,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: SecurityGuardResponse | null;
  onSaved: (id?: string | null, message?: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setEmail(initial.email ?? "");
      setPhoneNumber(initial.phoneNumber ?? "");
      setPassword("");
      setConfirmPassword("");
    }
    if (mode === "create") {
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
    }
    setError(null);
    setSuccess(null);
  }, [open, mode, initial]);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const phoneValid = useMemo(
    () => phoneNumber.trim() === "" || /^\d{10,11}$/.test(phoneNumber.trim()),
    [phoneNumber]
  );
  const canSubmit = useMemo(() => {
    if (mode === "create") {
      const pOk = password.trim().length > 0;
      const cOk = confirmPassword.trim().length > 0 && confirmPassword === password;
      return emailValid && pOk && cOk && !saving;
    }
    return emailValid && phoneValid && !saving;
  }, [mode, emailValid, password, confirmPassword, phoneValid, saving]);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === "create") {
        const payload: CreateSecurityGuardCommand = {
          email: email.trim(),
          password: password.trim(),
          confirmPassword: confirmPassword.trim(),
        };
        const msg = await createSecurityGuard(payload);
        setSuccess(msg);
        onSaved(null, msg);
        onClose();
      } else if (mode === "edit" && initial) {
        const payload: UpdateSecurityGuardCommand = {
          email: email.trim(),
          phoneNumber: phoneNumber.trim() || null,
        };
        await updateSecurityGuard(initial.id, payload);
        setSuccess("Cập nhật bảo vệ thành công");
        onSaved(initial.id);
        onClose();
      }
    } catch (e: any) {
      setError(e?.message ?? "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "create" ? "Thêm bảo vệ" : "Sửa bảo vệ"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              size="small"
            />
          </Grid>
          {mode === "edit" && (
            <Grid item xs={12} md={6}>
              <TextField
                label="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                helperText={phoneValid ? undefined : "Số điện thoại 10–11 chữ số"}
                error={!phoneValid}
              />
            </Grid>
          )}
          {mode === "create" && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Xác nhận mật khẩu"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  error={confirmPassword.trim().length > 0 && confirmPassword !== password}
                  helperText={
                    confirmPassword.trim().length > 0 && confirmPassword !== password
                      ? "Mật khẩu không khớp"
                      : undefined
                  }
                />
              </Grid>
            </>
          )}
        </Grid>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        {success && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">{success}</Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          variant="contained"
          color="primary"
          startIcon={mode === "create" ? <AddCircleOutlineIcon /> : <SaveIcon />}
        >
          {mode === "create" ? "Tạo" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
