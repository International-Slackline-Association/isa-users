import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { countries } from 'countries-list';

interface Props {
  defaultValue?: string;
  onChange: (value: string) => void;
}

const countryList = Object.entries(countries).map(([key, value]) => ({
  code: key,
  name: value.name,
}));

export default function CountrySelect(props: Props) {
  const defaultValue = props.defaultValue
    ? countryList.filter((c) => c.code === props.defaultValue)[0]
    : undefined;

  return (
    <Autocomplete
      options={countryList}
      autoHighlight
      defaultValue={defaultValue}
      getOptionLabel={(option) => option.name}
      onChange={(event, value) => {
        props.onChange(value!.code);
      }}
      fullWidth
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.name} ({option.code})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Country"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
