import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import Layout from '../components/Layout'; // Import the Layout component
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Import Firebase services
import { db } from '../services/firebase'; // Assuming you have Firebase initialized in services/firebase.js
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [accommodations, setAccommodations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accommodations from Firestore
        const accommodationsSnapshot = await getDocs(collection(db, 'accommodations'));
        const accommodationsList = accommodationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccommodations(accommodationsList);

        // Fetch reservations from Firestore
        const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
        const reservationsList = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(reservationsList);

        // Fetch users from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Data for the line chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Statistics',
        data: [10, 25, 15, 30, 20, 35], // Example static data
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
    <Layout title="Dashboard Overview"> {/* Wrap content in Layout */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Users</Typography>
              <Typography variant="body1">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Reservations</Typography>
              <Typography variant="body1">{reservations.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Accommodations</Typography>
              <Typography variant="body1">{accommodations.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional content like charts */}
      <Box sx={{ mt: 5, height: 620 }}> 
        <Typography variant="h6" sx={{ mb: 2 }}>Monthly Statistics</Typography>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ height: '60%', width: '60%' }}>
              <Line data={data} options={options} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}

export default Dashboard;