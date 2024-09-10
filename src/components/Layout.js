
import React from 'react';
import { Box, Typography } from '@mui/material';

const Layout = ({ title, children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box
        sx={{
          width: 250,
          bgcolor: '#f4f4f4',
          p: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6">Sidebar</Typography>
        {/* Add more sidebar content or links here */}
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 3,
          bgcolor: '#fff',
          overflow: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom>{title}</Typography>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;