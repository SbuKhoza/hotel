import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration for the client (You can find this in your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCm2BWy4yC5E9KVwvY7YF374tgEJww2gj0",
  authDomain: "steady-4edfa.firebaseapp.com",
  projectId: "steady-4edfa",
  storageBucket: "steady-4edfa.appspot.com",
  messagingSenderId: "353114065302",
  appId: "1:353114065302:web:7000e3e9492d77c03c35b7",
  measurementId: "G-WEXYLZWL4G"
};

const app = initializeApp(firebaseConfig);

// Export instances for Firestore, Auth, and Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

// Function to add a new accommodation
export const addAccommodation = async (accommodationData, imageFiles) => {
  try {
    // Create a new document in the "accommodations" collection
    const docRef = await addDoc(collection(db, 'accommodations'), {
      title: accommodationData.title,
      description: accommodationData.description,
      amenities: accommodationData.amenities,
      imagePaths: [],
      frontImagePath: '' // Will be updated with the front image path later
    });

    const imagePaths = [];
    let frontImagePath = '';

    // Upload images to Firebase Storage
    for (const [index, file] of imageFiles.entries()) {
      const imageRef = ref(storage, `accommodations/${docRef.id}/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      if (index === 0) {
        frontImagePath = downloadURL; // Use downloadURL for front image
      }
      imagePaths.push(downloadURL); // Push the downloadURL, not the file name
    }

    // Update the accommodation document with the image paths and front image path
    await updateDoc(docRef, {
      imagePaths,
      frontImagePath
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding accommodation:', error);
    throw error;
  }
};
