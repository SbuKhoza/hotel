import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import './AdminLogin.css';
import { auth, db } from '../../services/firebase'; // Import Firestore
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions for document retrieval

function AdminLogin({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is an admin by looking for their UID in the admins collection
      const adminDocRef = doc(db, 'admins', user.uid); // Reference to admin doc using UID
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        // If user is found in the 'admins' collection, proceed to dashboard
        onClose(); // Close the login dialog on success
        navigate('/dashboard');
      } else {
        // If not an admin, show an error
        setError('You do not have admin privileges.');
        await auth.signOut(); // Sign the user out if they are not an admin
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Error signing in:', err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        mt: 8,
        padding: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Admin Login
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            Login
          </Button>
        </form>
      )}
    </Box>
  );
}

export default AdminLogin;
