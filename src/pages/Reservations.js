import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsCollection = collection(db, 'bookings');
      const reservationsSnapshot = await getDocs(reservationsCollection);
      const reservationsList = reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(reservationsList);
    };

    fetchReservations();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: 'Approved' });
      setReservations(
        reservations.map(res => res.id === id ? { ...res, status: 'Approved' } : res)
      );
    } catch (error) {
      console.error('Error approving reservation:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: 'Rejected' });
      setReservations(
        reservations.map(res => res.id === id ? { ...res, status: 'Rejected' } : res)
      );
    } catch (error) {
      console.error('Error rejecting reservation:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setReservations(reservations.filter(res => res.id !== id));
      alert('Reservation deleted successfully.');
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Reservations</Typography>
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
    </Box>
  );
}

export default Reservations;