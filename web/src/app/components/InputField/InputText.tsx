import { TextField } from '@mui/material';

interface Props {
  label: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
  placeholderText?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export const InputText = (props: Props) => {
  const { label, onChange, defaultValue, placeholderText, required, ...rest } = props;
  return (
    <TextField
      label={label}
      variant="outlined"
      autoComplete="off"
      required={required}
      defaultValue={defaultValue}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      fullWidth
      placeholder={placeholderText}
      {...rest}
    />
  );
};
