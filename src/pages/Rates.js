// components/Rates.js
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, Modal, TextField } from '@mui/material';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';

function Rates() {
  const [rates, setRates] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      const ratesCollection = collection(db, 'rates');
      const ratesSnapshot = await getDocs(ratesCollection);
      const ratesList = ratesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRates(ratesList);
    };

    fetchRates();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'rates', id));
      setRates(rates.filter(rate => rate.id !== id));
      alert('Rate deleted successfully.');
    } catch (error) {
      console.error('Error deleting rate:', error);
    }
  };

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
        // Update existing rate
        const rateRef = doc(db, 'rates', selectedRate.id);
        await updateDoc(rateRef, { name, amount });
        setRates(rates.map(rate => (rate.id === selectedRate.id ? { ...rate, name, amount } : rate)));
        alert('Rate updated successfully.');
      } else {
        // Create new rate
        const newRateRef = await addDoc(collection(db, 'rates'), { name, amount });
        setRates([...rates, { id: newRateRef.id, name, amount }]);
        alert('Rate created successfully.');
      }
      handleClose();
    } catch (error) {
      console.error('Error creating/updating rate:', error);
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

      <Modal open={open} onClose={handleClose}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">{selectedRate ? 'Edit Rate' : 'Add Rate'}</Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {selectedRate ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

export default Rates;