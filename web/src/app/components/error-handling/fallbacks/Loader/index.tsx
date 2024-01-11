import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function LoaderErrorBoundaryFallback() {
  return (
    <Box>
      <Typography variant="h5">{}</Typography>
    </Box>
  );
}
