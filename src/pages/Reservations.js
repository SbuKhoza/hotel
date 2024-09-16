import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid } from '@mui/material';
import Layout from '../components/Layout';

// Import Firebase services
import { db } from '../services/firebase'; // Assuming Firebase is initialized in services/firebase.js
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function Reservations() {
  const [reservations, setReservations] = useState([]);

  // Fetch reservations from Firestore
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
        const reservationsList = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservations(reservationsList);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleApprove = async (id) => {
    try {
      const reservationRef = doc(db, 'reservations', id);
      await updateDoc(reservationRef, { status: 'Approved' });
      setReservations(reservations.map(res => (res.id === id ? { ...res, status: 'Approved' } : res)));
      alert('Reservation approved.');
    } catch (error) {
      console.error('Error approving reservation:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const reservationRef = doc(db, 'reservations', id);
      await updateDoc(reservationRef, { status: 'Rejected' });
      setReservations(reservations.map(res => (res.id === id ? { ...res, status: 'Rejected' } : res)));
      alert('Reservation rejected.');
    } catch (error) {
      console.error('Error rejecting reservation:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      setReservations(reservations.filter(reservation => reservation.id !== id));
      alert('Reservation deleted.');
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <Layout title="Manage Reservations">
      <Grid container spacing={3}>
        {reservations.map(reservation => (
          <Grid item xs={12} sm={6} key={reservation.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{reservation.roomType}</Typography>
                <Typography variant="body2">Guest: {reservation.guest}</Typography>
                <Typography variant="body2">Status: {reservation.status}</Typography>
                <Button variant="outlined" color="success" sx={{ mt: 2 }} onClick={() => handleApprove(reservation.id)}>Approve</Button>
                <Button variant="outlined" color="error" sx={{ mt: 2, ml: 2 }} onClick={() => handleReject(reservation.id)}>Reject</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => handleDelete(reservation.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default Reservations;