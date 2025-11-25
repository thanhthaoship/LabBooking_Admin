"use client";

import { createAccount, updateAccount } from "@/actions/account.action";
import { AccountModel, AccountRoles } from "@/config/models/account";
import { ADMIN_ROUTES } from "@/config/routes";
import {
  AccountSchema,
  CreateAccountRequest,
} from "@/config/schema/account/account.schema";
import { useActionHandler } from "@/hooks/useActionHandler";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface AccountFormProps {
  initialValues?: AccountModel;
}

export default function AccountForm({ initialValues }: AccountFormProps) {
  const { handleActionResult } = useActionHandler();
  const isEdit = Boolean(initialValues);
  const router = useRouter();

  const formik = useFormik<CreateAccountRequest>({
    initialValues: {
      fullname: initialValues?.fullname || "",
      phoneNumber: initialValues?.phoneNumber || "",
      isActive: isEdit ? initialValues?.isActive === true : true,
      roleName: initialValues?.roleName || AccountRoles.Manager,
      email: initialValues?.email || "",
      address: initialValues?.address || "",
      gender: initialValues?.gender || false,
      dateOfBirth: initialValues?.dateOfBirth
        ? new Date(initialValues.dateOfBirth)
        : null,
      totalPoints: initialValues?.totalPoints || 0,
      totalSpin: initialValues?.totalSpin || 0,
    },
    validationSchema: toFormikValidationSchema(AccountSchema),
    onSubmit: async (values: CreateAccountRequest) => {
      const response = isEdit
        ? await updateAccount({
            ...values,
            id: initialValues?.id!,
          })
        : await createAccount(values);

      handleActionResult(response, {
        redirectUrl: ADMIN_ROUTES.ACCOUNT.INDEX,
      });
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="fullname"
              label="Họ và tên"
              value={values.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullname && !!errors.fullname}
              helperText={touched.fullname && errors.fullname}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Số điện thoại"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phoneNumber && !!errors.phoneNumber}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email"
              value={values.email || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              name="roleName"
              label="Vai trò"
              value={values.roleName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.roleName && !!errors.roleName}
              helperText={touched.roleName && errors.roleName}
            >
              <MenuItem value={AccountRoles.Manager}>Quản lý</MenuItem>
              <MenuItem value={AccountRoles.User}>Người dùng</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              name="gender"
              label="Giới tính"
              value={values.gender}
              onChange={(e) =>
                setFieldValue("gender", e.target.value === "true")
              }
              onBlur={handleBlur}
              error={touched.gender && !!errors.gender}
              helperText={touched.gender && errors.gender}
            >
              <MenuItem value="true">Nam</MenuItem>
              <MenuItem value="false">Nữ</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Ngày sinh"
              value={values.dateOfBirth ? values.dateOfBirth : null}
              onChange={(date) => setFieldValue("dateOfBirth", date)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: touched.dateOfBirth && !!errors.dateOfBirth,
                  helperText: touched.dateOfBirth && errors.dateOfBirth,
                },
              }}
            />
          </Grid>

          {values.roleName === AccountRoles.User && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="totalPoints"
                  label="Điểm tích lũy"
                  type="number"
                  value={values.totalPoints}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.totalPoints && !!errors.totalPoints}
                  helperText={touched.totalPoints && errors.totalPoints}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="totalSpin"
                  label="Số lượt quay"
                  type="number"
                  value={values.totalSpin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.totalSpin && !!errors.totalSpin}
                  helperText={touched.totalSpin && errors.totalSpin}
                />
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={values.isActive}
                  onChange={(e) => setFieldValue("isActive", e.target.checked)}
                />
              }
              label="Đang hoạt động"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="address"
              label="Địa chỉ"
              value={values.address || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && !!errors.address}
              helperText={touched.address && errors.address}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }} mt={3}>
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{ mr: 2 }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              disabled={formik.isSubmitting}
              onClick={() => router.push(ADMIN_ROUTES.ACCOUNT.INDEX)}
            >
              Hủy
            </Button>
          </Box>
        </Grid>
      </form>
    </Card>
  );
}
