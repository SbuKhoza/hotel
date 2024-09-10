// components/Users.js
import React, { useEffect, useState } from 'react';
import { /*Box,*/ Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';

function Users() {
  const [users, setUsers] = useState([]);

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

  return (
    <Layout title="Manage Users">
      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item xs={12} sm={6} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }}>Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => handleDelete(user.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default Users;