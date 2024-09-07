import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';

function Users() {

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item xs={12} sm={6} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }}>Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Users;