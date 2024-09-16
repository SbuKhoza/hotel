import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Layout from '../components/Layout';

// Import Firebase services
import { db } from '../services/firebase'; // Assuming Firebase is initialized in services/firebase.js
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
      alert('User deleted.');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    if (user) {
      setName(user.name);
      setEmail(user.email);
    } else {
      setName('');
      setEmail('');
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (selectedUser) {
      // Update existing user
      try {
        const userRef = doc(db, 'users', selectedUser.id);
        await updateDoc(userRef, { name, email });
        setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, name, email } : user)));
        alert('User updated successfully.');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      // Create new user
      try {
        const newUser = { name, email };
        const docRef = await addDoc(collection(db, 'users'), newUser);
        setUsers([...users, { id: docRef.id, ...newUser }]);
        alert('User added successfully.');
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
    handleClose();
  };

  return (
    <Layout title="Manage Users">
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add User
      </Button>
      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item xs={12} sm={6} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(user)}>Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => handleDelete(user.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setName(''); setEmail(''); }} color="warning">
            Clear Form
          </Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Users;