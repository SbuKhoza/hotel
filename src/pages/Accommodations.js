import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField } from '@mui/material';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Layout from '../components/Layout';

function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [editingAccommodationId, setEditingAccommodationId] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState({ name: '', description: '', images: [] });

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const accommodationsCollection = collection(db, 'accommodations');
        const accommodationsSnapshot = await getDocs(accommodationsCollection);
        const accommodationsList = accommodationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAccommodations(accommodationsList);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
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
    setEditingAccommodation((prev) => ({ ...prev, images: files }));
  };

  const handleClearAll = () => {
    setEditingAccommodation({ name: '', description: '', images: [] });
  };

  const handleUpdateAccommodation = async (id) => {
    try {
      const updatedData = {
        name: editingAccommodation.name,
        description: editingAccommodation.description,
      };

      if (editingAccommodation.images.length > 0) {
        const imageUrls = await Promise.all(
          editingAccommodation.images.map(async (imageFile) => {
            const imageRef = ref(storage, `accommodations/${id}/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
          })
        );
        updatedData.images = imageUrls; // Store the image URLs in Firestore
      }

      await updateDoc(doc(db, 'accommodations', id), updatedData);
      setAccommodations(accommodations.map((acc) => (acc.id === id ? { ...acc, ...updatedData } : acc)));
      setEditingAccommodationId(null);
    } catch (error) {
      console.error('Error updating accommodation:', error);
    }
  };

  const handleDeleteAccommodation = async (id) => {
    try {
      await deleteDoc(doc(db, 'accommodations', id));
      setAccommodations(accommodations.filter((acc) => acc.id !== id));
    } catch (error) {
      console.error('Error deleting accommodation:', error);
    }
  };

  return (
    <Layout title="Accommodations">
      <Grid container spacing={3}>
        {accommodations.map((accommodation) => (
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
                    <Button
                      variant="contained"
                      component="label"
                    >
                      Upload Images
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                      />
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
                    {accommodation.images.map((url, index) => (
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
        ))}
      </Grid>
    </Layout>
  );
}

export default Accommodations;
