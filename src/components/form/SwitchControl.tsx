import { FormControlLabel, Switch, SwitchProps } from "@mui/material";
import { ReactNode } from "react";

interface SwitchControlProps {
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;
  color?: SwitchProps["color"];
  disabled?: boolean;
  size?: SwitchProps["size"];
  labelPlacement?: "start" | "end" | "top" | "bottom";
  sx?: any;
}

const SwitchControl = ({
  name,
  checked,
  onChange,
  label,
  color = "primary",
  disabled = false,
  size = "medium",
  labelPlacement = "end",
  sx,
}: SwitchControlProps) => {
  return (
    <FormControlLabel
      control={
        <Switch
          name={name}
          checked={checked}
          onChange={onChange}
          color={color}
          disabled={disabled}
          size={size}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      sx={sx}
      disabled={disabled}
    />
  );
};

export default SwitchControl;