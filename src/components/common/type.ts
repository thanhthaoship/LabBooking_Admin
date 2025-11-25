export type SelectValue = string | number;

export interface IOption {
  value: SelectValue;
  label: string;
}

export interface ICustomSelectProps {
  value?: SelectValue;
  onChange: (value: any) => void;
  options: IOption[];
  label: string;
  minWidth?: number;
}
