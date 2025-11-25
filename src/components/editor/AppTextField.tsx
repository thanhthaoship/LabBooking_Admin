"use client";
import { Stack, TextField, TextFieldProps } from "@mui/material";
import { H6 } from "../Typography";

type IProps = TextFieldProps;

const AppTextField = (props: IProps) => {
  return (
    <Stack gap={1}>
      {props.label && <H6>{props.label}</H6>}

      <TextField {...props} label="" />
    </Stack>
  );
};

export default AppTextField;
