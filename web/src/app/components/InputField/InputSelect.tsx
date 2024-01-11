import { MenuItem, TextField } from '@mui/material';

interface Props {
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholderText?: string;
  error?: boolean;
  helperText?: string;
}

export const InputSelect = (props: Props) => {
  const { label, onChange, placeholderText, required, defaultValue, options, ...rest } = props;
  return (
    <TextField
      label={label}
      variant="outlined"
      select
      required={required}
      defaultValue={defaultValue || ''}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={placeholderText}
      fullWidth
      {...rest}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
