import { useEffect, useState } from 'react';
import { getBookingsFromFirestore, approveBooking, rejectBooking, removeBooking } from '../firebase/firestoreService';

const AdminReservationManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsData = await getBookingsFromFirestore();
      setBookings(bookingsData);
    };
    fetchBookings();
  }, []);

  const handleApprove = async (bookingId) => {
    await approveBooking(bookingId);
    // Optionally, refetch bookings or update local state
  };

  const handleReject = async (bookingId) => {
    await rejectBooking(bookingId);
  };

  const handleDeleteBooking = async (bookingId) => {
    await removeBooking(bookingId);
    setBookings(bookings.filter(booking => booking.id !== bookingId));
  };

  return (
    <div>
      <h2>Reservation Management</h2>
      {bookings.map(booking => (
        <div key={booking.id}>
          <p>{booking.roomType}</p>
          <button onClick={() => handleApprove(booking.id)}>Approve</button>
          <button onClick={() => handleReject(booking.id)}>Reject</button>
          <button onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminReservationManagement;