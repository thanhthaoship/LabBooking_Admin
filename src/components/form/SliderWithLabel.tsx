import { H6, Span } from "@/components/Typography";
import { Slider, SliderProps, Stack } from "@mui/material";
import { FlexBetween } from "../flex-box";
import { currency, formatNumber } from "@/lib";

type Suffix = "%" | "đ" | "người" | "luợt" | "giây" | "";

interface SliderWithLabelProps {
  name: string;
  label: string;
  value: number;
  onChange: (name: string, value: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLSpanElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  valueSuffix?: Suffix;
  valueColor?: string;
  sliderProps?: Omit<SliderProps, "value" | "onChange" | "onBlur" | "name">;
  marks?: boolean;
  showFooter?: boolean;
}

const SliderWithLabel = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  min = 0,
  max = 100,
  step = 1,
  error,
  valueSuffix = "",
  valueColor = "red",
  sliderProps,
  marks = false,
  showFooter = true,
}: SliderWithLabelProps) => {
  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(name, newValue);
  };

  const spaceBetween = valueSuffix === "đ" || valueSuffix == "%" ? "" : " ";

  return (
    <Stack spacing={1}>
      <H6>
        <Span>{label}</Span>
        {valueSuffix && (
          <Span color={valueColor}>
            {valueSuffix === "đ"
              ? currency(value)
              : `${formatNumber(value)}${spaceBetween}${valueSuffix}`}
          </Span>
        )}
      </H6>
      <Slider
        aria-labelledby={`${name}-slider`}
        value={typeof value === "number" ? value : 0}
        onChange={handleChange}
        onBlur={onBlur}
        valueLabelDisplay="auto"
        valueLabelFormat={
          valueSuffix === "đ"
            ? currency(value)
            : `${formatNumber(value)}${spaceBetween}${valueSuffix}`
        }
        step={step}
        min={min}
        max={max}
        name={name}
        marks={marks}
        {...sliderProps}
      />
      {showFooter && (
        <FlexBetween>
          <H6>
            {valueSuffix === "đ"
              ? currency(min)
              : `${formatNumber(min)}${spaceBetween}${valueSuffix}`}
          </H6>
          <H6>
            {valueSuffix === "đ"
              ? currency(max)
              : `${formatNumber(max)}${spaceBetween}${valueSuffix}`}
          </H6>
        </FlexBetween>
      )}
      {error && <Span color="red">{error}</Span>}
    </Stack>
  );
};

export default SliderWithLabel;
