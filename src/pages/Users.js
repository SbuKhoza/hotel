// components/Users.js
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, Modal, TextField } from '@mui/material';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';

function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
      alert('User deleted successfully.');
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
    try {
      if (selectedUser) {
        // Update existing user
        const userRef = doc(db, 'users', selectedUser.id);
        await updateDoc(userRef, { name, email });
        setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, name, email } : user)));
        alert('User updated successfully.');
      } else {
        // Create new user
        const newUserRef = await addDoc(collection(db, 'users'), { name, email });
        setUsers([...users, { id: newUserRef.id, name, email }]);
        alert('User created successfully.');
      }
      handleClose();
    } catch (error) {
      console.error('Error creating/updating user:', error);
    }
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

      <Modal open={open} onClose={handleClose}>
        <div style={{ padding: 20 }}>
          <Typography variant="h6">{selectedUser ? 'Edit User' : 'Add User'}</Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

export default Users;