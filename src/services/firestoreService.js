// firestoreService.js

import { collection, doc, getDocs, setDoc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Your Firebase config

// Users
export const addUserToFirestore = async (userId, userData) => {
  await setDoc(doc(db, 'users', userId), userData);
};

export const getUsersFromFirestore = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const removeUserFromFirestore = async (userId) => {
  await deleteDoc(doc(db, 'users', userId));
};

// Bookings
export const addBookingToFirestore = async (booking) => {
  await addDoc(collection(db, 'bookings'), booking);
};

export const getBookingsFromFirestore = async () => {
  const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
  return bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approveBooking = async (bookingId) => {
  await updateDoc(doc(db, 'bookings', bookingId), { status: 'approved' });
};

export const rejectBooking = async (bookingId) => {
  await updateDoc(doc(db, 'bookings', bookingId), { status: 'rejected' });
};

export const removeBooking = async (bookingId) => {
  await deleteDoc(doc(db, 'bookings', bookingId));
};
