import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';

function Reservations() {
  // Placeholder data for reservations
  const reservations = [
    { id: 1, room: 'Deluxe Room', guest: 'John Doe', status: 'Pending' },
    { id: 2, room: 'Executive Suite', guest: 'Jane Smith', status: 'Approved' },
    // Add more reservation data
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Reservations</Typography>
      <Grid container spacing={3}>
        {reservations.map(reservation => (
          <Grid item xs={12} sm={6} key={reservation.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{reservation.room}</Typography>
                <Typography variant="body2">Guest: {reservation.guest}</Typography>
                <Typography variant="body2">Status: {reservation.status}</Typography>
                <Button variant="outlined" color="success" sx={{ mt: 2 }}>Approve</Button>
                <Button variant="outlined" color="error" sx={{ mt: 2, ml: 2 }}>Reject</Button>
                <Button variant="outlined" sx={{ mt: 2, ml: 2 }}>Update</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Reservations;