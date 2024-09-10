import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Admin.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  // Data for the line chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Statistics',
        data: [10, 25, 15, 30, 20, 35],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return ` ${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

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
        
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 3,
          bgcolor: '#fff',
          overflow: 'auto',
        }}
      >
        {/* <Typography variant="h4">Welcome to the Admin Dashboard</Typography> */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          Here you can get an overview of everything.
        </Typography>
        {/* <Button variant="contained" color="primary" sx={{ mb: 3 }}>
          Create Booking
        </Button> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Total Rooms</Typography>
                <Typography variant="body1">100</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Booked Rooms</Typography>
                <Typography variant="body1">50</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Vacant Rooms</Typography>
                <Typography variant="body1">30</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Customer Feedback Overview</Typography>
          <Card>
            <CardContent>
              <Typography variant="body1">Positive: 80%</Typography>
              <Typography variant="body1">Neutral: 15%</Typography>
              <Typography variant="body1">Negative: 5%</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ mt: 5, height: 300 }}> {/* Set a fixed height here */}
          <Typography variant="h6" sx={{ mb: 2 }}>Monthly Statistics</Typography>
          <Card>
            <CardContent sx={{ p: 0 }}> {/* Remove padding if needed */}
              <Box sx={{ height: '60%', width: '60%' }}> {/* Ensure the graph takes full space */}
                <Line data={data} options={options} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;