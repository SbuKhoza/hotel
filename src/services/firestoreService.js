import { collection, addDoc, deleteDoc, doc, getDocs, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore instance

// Functions for booking management
export const addBookingToFirestore = async (booking) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), booking);
    return docRef.id; // Returns Firestore generated ID
  } catch (e) {
    console.error("Error adding booking: ", e);
    throw e;
  }
};

export const removeBookingFromFirestore = async (bookingId) => {
  try {
    await deleteDoc(doc(db, "bookings", bookingId));
    console.log("Booking removed from Firestore with ID:", bookingId);
  } catch (e) {
    console.error("Error removing booking: ", e);
    throw e;
  }
};

// Functions for user management
export const addUserToFirestore = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), userData);
    console.log("User added to Firestore with ID:", userId);
  } catch (e) {
    console.error("Error adding user: ", e);
    throw e;
  }
};

export const getUserFromFirestore = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching user: ", e);
    throw e;
  }
};

export const updateUserInFirestore = async (userId, updatedData) => {
  try {
    await updateDoc(doc(db, "users", userId), updatedData);
    console.log("User updated in Firestore with ID:", userId);
  } catch (e) {
    console.error("Error updating user: ", e);
    throw e;
  }
};

export const removeUserFromFirestore = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("User removed from Firestore with ID:", userId);
  } catch (e) {
    console.error("Error removing user: ", e);
    throw e;
  }
};

// Functions for accommodation management
export const addAccommodationToFirestore = async (accommodation) => {
  try {
    const docRef = await addDoc(collection(db, "accommodations"), accommodation);
    return docRef.id; // Returns Firestore generated ID
  } catch (e) {
    console.error("Error adding accommodation: ", e);
    throw e;
  }
};

export const getAccommodationsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "accommodations"));
    const accommodations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return accommodations;
  } catch (e) {
    console.error("Error fetching accommodations: ", e);
    throw e;
  }
};

export const updateAccommodationInFirestore = async (id, updatedData) => {
  try {
    await updateDoc(doc(db, "accommodations", id), updatedData);
    console.log("Accommodation updated in Firestore with ID:", id);
  } catch (e) {
    console.error("Error updating accommodation: ", e);
    throw e;
  }
};

export const removeAccommodationFromFirestore = async (id) => {
  try {
    await deleteDoc(doc(db, "accommodations", id));
    console.log("Accommodation removed from Firestore with ID:", id);
  } catch (e) {
    console.error("Error removing accommodation: ", e);
    throw e;
  }
};