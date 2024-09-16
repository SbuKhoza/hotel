import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Layout from '../components/Layout';

// Import Firebase services
import { db } from '../services/firebase'; // Assuming Firebase is initialized in services/firebase.js
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

function Rates() {
  const [rates, setRates] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Fetch rates from Firestore
    const fetchRates = async () => {
      try {
        const ratesSnapshot = await getDocs(collection(db, 'rates'));
        const ratesList = ratesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRates(ratesList);
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };

    fetchRates();
  }, []);

  const handleOpen = (rate = null) => {
    setSelectedRate(rate);
    if (rate) {
      setName(rate.name);
      setAmount(rate.amount);
    } else {
      setName('');
      setAmount('');
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (selectedRate) {
        // Update existing rate in Firestore
        const rateRef = doc(db, 'rates', selectedRate.id);
        await updateDoc(rateRef, { name, amount });
        setRates(rates.map(rate => (rate.id === selectedRate.id ? { ...rate, name, amount } : rate)));
        alert('Rate updated successfully.');
      } else {
        // Create new rate in Firestore
        const newRate = { name, amount: `R${amount}` };
        const docRef = await addDoc(collection(db, 'rates'), newRate);
        setRates([...rates, { id: docRef.id, ...newRate }]);
        alert('Rate created successfully.');
      }
    } catch (error) {
      console.error('Error saving rate:', error);
      alert('Failed to save rate.');
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      // Delete rate from Firestore
      await deleteDoc(doc(db, 'rates', id));
      setRates(rates.filter(rate => rate.id !== id));
      alert('Rate deleted successfully.');
    } catch (error) {
      console.error('Error deleting rate:', error);
      alert('Failed to delete rate.');
    }
  };

  return (
    <Layout title="Rates">
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Rate
      </Button>
      <Grid container spacing={3}>
        {rates.map(rate => (
          <Grid item xs={12} sm={6} key={rate.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{rate.name}</Typography>
                <Typography variant="body2">{rate.amount}</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(rate)}>Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => handleDelete(rate.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedRate ? 'Edit Rate' : 'Add Rate'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Amount (R)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setName(''); setAmount(''); }} color="warning">
            Clear Form
          </Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success">
            {selectedRate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Rates;