// components/Specials.js
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, Modal, TextField } from '@mui/material';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';

function Specials() {
  const [specials, setSpecials] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchSpecials = async () => {
      const specialsCollection = collection(db, 'specials');
      const specialsSnapshot = await getDocs(specialsCollection);
      const specialsList = specialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpecials(specialsList);
    };

    fetchSpecials();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'specials', id));
      setSpecials(specials.filter(special => special.id !== id));
      alert('Special deleted successfully.');
    } catch (error) {
      console.error('Error deleting special:', error);
    }
  };

  const handleOpen = (special = null) => {
    setSelectedSpecial(special);
    if (special) {
      setTitle(special.title);
      setDescription(special.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (selectedSpecial) {
        // Update existing special
        const specialRef = doc(db, 'specials', selectedSpecial.id);
        await updateDoc(specialRef, { title, description });
        setSpecials(specials.map(special => (special.id === selectedSpecial.id ? { ...special, title, description } : special)));
        alert('Special updated successfully.');
      } else {
        // Create new special
        const newSpecialRef = await addDoc(collection(db, 'specials'), { title, description });
        setSpecials([...specials, { id: newSpecialRef.id, title, description }]);
        alert('Special created successfully.');
      }
      handleClose();
    } catch (error) {
      console.error('Error creating/updating special:', error);
    }
  };

  return (
    <Layout title="Specials">
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Special
      </Button>
      <Grid container spacing={3}>
        {specials.map(special => (
          <Grid item xs={12} sm={6} key={special.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{special.title}</Typography>
                <Typography variant="body2">{special.description}</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(special)}>Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => handleDelete(special.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">{selectedSpecial ? 'Edit Special' : 'Add Special'}</Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {selectedSpecial ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

export default Specials;
