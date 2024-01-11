import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function AppErrorBoundaryFallback() {
  return (
    <Box height={400}>
      <Paper sx={{ p: 5 }}>
        <Typography variant="h5" component="h3">
          Something went wrong. Unknown error.
        </Typography>
      </Paper>
    </Box>
  );
}

export default AppErrorBoundaryFallback;
