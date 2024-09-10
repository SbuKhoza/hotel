
import { useEffect, useState } from 'react';
import { getAllBookings, updateBooking, removeBookingFromFirestore } from '../services/firestoreService';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const allBookings = await getAllBookings();
        setBookings(allBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      await updateBooking(bookingId, updatedData);
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, ...updatedData } : booking
      ));
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await removeBookingFromFirestore(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  return (
    <div>
      <h1>Booking Management</h1>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            <span>{booking.name} - {booking.date}</span>
            <button onClick={() => handleUpdateBooking(booking.id, { status: 'Confirmed' })}>Update</button>
            <button onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBookingManagement;