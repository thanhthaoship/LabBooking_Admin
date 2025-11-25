import { TextField, TextFieldProps } from "@mui/material";
import { FormikProps } from "formik";

interface Option {
  value: string | number;
  label: string;
}

interface FormikSelectProps extends Omit<TextFieldProps, "onChange" | "value"> {
  name: string;
  options: Option[];
  formik: FormikProps<any>;
  placeholder?: string;
}

export default function FormikSelect({
  name,
  options,
  formik,
  placeholder,
  ...props
}: FormikSelectProps) {
  return (
    <TextField
      select
      fullWidth
      name={name}
      value={formik.values[name] || "-1"}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && (formik.errors[name] as any)}
      slotProps={{
        select: {
          native: true,
        },
      }}
      {...props}
    >
      <option value="-1">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
}
