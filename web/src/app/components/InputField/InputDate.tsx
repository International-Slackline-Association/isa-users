import { TextField } from '@mui/material';

interface Props {
  label: string;
  defaultValue?: string;
  required?: boolean;
  placeholderText?: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export const InputDate = (props: Props) => {
  const { label, onChange, defaultValue, required, ...rest } = props;
  return (
    <TextField
      label={label}
      variant="outlined"
      type={'date'}
      required={required}
      defaultValue={defaultValue || '2000-01-01'}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      fullWidth
      {...rest}
    />
  );
};
