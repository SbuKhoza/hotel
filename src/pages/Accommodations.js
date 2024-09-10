import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField } from '@mui/material';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';

function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [editingAccommodationId, setEditingAccommodationId] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const accommodationsCollection = collection(db, 'accommodations');
        const accommodationsSnapshot = await getDocs(accommodationsCollection);
        const accommodationsList = accommodationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccommodations(accommodationsList);
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
      }
    };

    fetchAccommodations();
  }, []);

  const handleEditClick = (accommodation) => {
    setEditingAccommodationId(accommodation.id);
    setEditingAccommodation({ name: accommodation.name, description: accommodation.description });
  };

  const handleUpdateAccommodation = async (id) => {
    try {
      await updateDoc(doc(db, 'accommodations', id), {
        name: editingAccommodation.name,
        description: editingAccommodation.description
      });
      setAccommodations(accommodations.map(acc => (acc.id === id ? { ...acc, ...editingAccommodation } : acc)));
      setEditingAccommodationId(null);
    } catch (error) {
      console.error('Error updating accommodation:', error);
    }
  };

  const handleDeleteAccommodation = async (id) => {
    try {
      await deleteDoc(doc(db, 'accommodations', id));
      setAccommodations(accommodations.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Error deleting accommodation:', error);
    }
  };

  return (
    <Layout title="Accommodations">
      <Grid container spacing={3}>
        {accommodations.map(accommodation => (
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
                    />
                    <TextField
                      label="Description"
                      value={editingAccommodation.description}
                      onChange={(e) => setEditingAccommodation({ ...editingAccommodation, description: e.target.value })}
                      fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={() => handleUpdateAccommodation(accommodation.id)}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setEditingAccommodationId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{accommodation.name}</Typography>
                    <Typography variant="body2">{accommodation.description}</Typography>
                    <Button variant="outlined" color="primary" onClick={() => handleEditClick(accommodation)}>Edit</Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDeleteAccommodation(accommodation.id)}>Delete</Button>
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
