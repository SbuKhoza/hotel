import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Import the storage instance

export const uploadImageToStorage = async (file) => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL; // Return the download URL
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};
