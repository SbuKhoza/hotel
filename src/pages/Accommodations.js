import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField } from '@mui/material';
import Layout from '../components/Layout';
import { db, storage } from '../services/firebase'; // Import Firebase services
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods

function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [editingAccommodationId, setEditingAccommodationId] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState({ name: '', description: '', images: [] });
  const [loading, setLoading] = useState(true);  // Add loading state
  const [imageFiles, setImageFiles] = useState([]);  // Image file state

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'accommodations'));
        const accommodationsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccommodations(accommodationsList);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchAccommodations();
  }, []);

  const handleEditClick = (accommodation) => {
    setEditingAccommodationId(accommodation.id);
    setEditingAccommodation({ name: accommodation.name, description: accommodation.description, images: [] });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleClearAll = () => {
    setEditingAccommodation({ name: '', description: '', images: [] });
    setImageFiles([]);
  };

  const handleUpdateAccommodation = async (id) => {
    try {
      let imageUrls = [];

      if (imageFiles.length > 0) {
        // Upload new images to Firebase Storage and get their URLs
        imageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            const storageRef = ref(storage, `accommodations/${file.name}`);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
          })
        );
      }

      const updatedData = {
        name: editingAccommodation.name,
        description: editingAccommodation.description,
        images: imageUrls.length > 0 ? imageUrls : editingAccommodation.images,
      };

      // Update accommodation data in Firestore
      const docRef = doc(db, 'accommodations', id);
      await updateDoc(docRef, updatedData);

      setAccommodations(accommodations.map((acc) => (acc.id === id ? { ...acc, ...updatedData } : acc)));
      setEditingAccommodationId(null);
      console.log('Accommodation updated successfully');
    } catch (error) {
      console.error('Error updating accommodation:', error);
    }
  };

  const handleDeleteAccommodation = async (id) => {
    try {
      // Delete accommodation data from Firestore
      const docRef = doc(db, 'accommodations', id);
      await deleteDoc(docRef);

      setAccommodations(accommodations.filter((acc) => acc.id !== id));
      console.log('Accommodation deleted successfully');
    } catch (error) {
      console.error('Error deleting accommodation:', error);
    }
  };

  if (loading) {
    return <div>Loading accommodations...</div>;  // Show loading indicator
  }

  return (
    <Layout title="Accommodations">
      <Grid container spacing={3}>
        {accommodations?.length > 0 ? (
          accommodations.map((accommodation) => (
            <Grid item xs={12} sm={6} key={accommodation.id}>
              <Card>
                <CardContent>
                  {editingAccommodationId === accommodation.id ? (
                    <>
                      <TextField
                        label="Name"
                        value={editingAccommodation.name}
                        onChange={(e) => setEditingAccommodation({ ...editingAccommodation, name: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Description"
                        value={editingAccommodation.description}
                        onChange={(e) => setEditingAccommodation({ ...editingAccommodation, description: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                      <Button variant="contained" component="label">
                        Upload Images
                        <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
                      </Button>
                      <Button onClick={() => handleUpdateAccommodation(accommodation.id)} color="primary">
                        Save
                      </Button>
                      <Button onClick={handleClearAll} color="secondary">
                        Clear All
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" component="div">
                        {accommodation.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {accommodation.description}
                      </Typography>
                      {accommodation.images?.map((url, index) => (
                        <img key={index} src={url} alt={`Accommodation ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                      ))}
                      <Button onClick={() => handleEditClick(accommodation)}>Edit</Button>
                      <Button onClick={() => handleDeleteAccommodation(accommodation.id)} color="secondary">
                        Delete
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No accommodations available</Typography>  // Fallback when no data
        )}
      </Grid>
    </Layout>
  );
}

export default Accommodations;