import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemText, ListItemIcon, Avatar, IconButton, InputBase, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import './AdminDashboard.css';
import { db, storage, auth } from '../services/firebase'; // Import Firebase services
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication

function AdminDashboard() {
  const location = useLocation();
  const [openAccommodationDialog, setOpenAccommodationDialog] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [accommodationData, setAccommodationData] = useState({
    name: '',
    description: '',
    price: '',
    availability: '',
    amenities: [],
    images: []
  });
  const [bookingData, setBookingData] = useState({
    clientName: '',
    checkInDate: null,
    checkInTime: null,
    checkOutDate: null,
    checkOutTime: null,
    accommodation: '',
    numberOfGuests: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const amenitiesOptions = [
    'WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Laundry'
  ];

  const handleClickOpenAccommodationDialog = () => {
    setOpenAccommodationDialog(true);
  };

  const handleCloseAccommodationDialog = () => {
    setOpenAccommodationDialog(false);
  };

  const handleClickOpenBookingDialog = () => {
    setOpenBookingDialog(true);
  };

  const handleCloseBookingDialog = () => {
    setOpenBookingDialog(false);
  };

  const handleAccommodationChange = (event) => {
    const { name, value } = event.target;
    if (name === 'amenities') {
      setAccommodationData({ ...accommodationData, [name]: value });
    } else {
      setAccommodationData({ ...accommodationData, [name]: value });
    }
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(files);
  };

  const handleAccommodationSubmit = async (event) => {
    event.preventDefault();

    // Check if user is authenticated
    if (!auth.currentUser) {
      setAuthError(true); // Trigger error snackbar if not authenticated
      return;
    }

    try {
      // Upload images to Firebase Storage and get their URLs
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const storageRef = ref(storage, `accommodations/${file.name}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      // Add accommodation data to Firestore
      await addDoc(collection(db, 'accommodations'), {
        ...accommodationData,
        images: imageUrls,
        createdAt: new Date(),
      });

      clearAccommodationForm();
      handleCloseAccommodationDialog();
      setSuccessMessage(true); // Trigger success snackbar
      console.log('Accommodation added successfully');
    } catch (error) {
      console.error('Error saving accommodation: ', error);
    }
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    try {
      // Simulate saving booking data
      console.log("Booking data:", bookingData);
      clearBookingForm();
      handleCloseBookingDialog();
    } catch (error) {
      console.error("Error saving booking: ", error);
    }
  };

  const clearAccommodationForm = () => {
    setAccommodationData({
      name: '',
      description: '',
      price: '',
      availability: '',
      amenities: [],
      images: []
    });
    setImageFiles([]);
  };

  const clearBookingForm = () => {
    setBookingData({
      clientName: '',
      checkInDate: null,
      checkInTime: null,
      checkOutDate: null,
      checkOutTime: null,
      accommodation: '',
      numberOfGuests: ''
    });
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/guests':
        return 'Guests';
      case '/accommodations':
        return 'Accommodations';
      case '/rates':
        return 'Rates';
      case '/specials':
        return 'Specials';
      case '/users':
        return 'Users';
      case '/reservations':
        return 'Reservations';
      case '/login':
        return 'Login';
      default:
        return 'Dashboard';
    }
  };

  // Function to create a new user (admin or guest)
  const createNewUser = async (email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role, // e.g., 'admin' or 'user'
        createdAt: new Date()
      });

      console.log('User created and saved in Firestore');
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  };

  // New function to create admin user
  const createAdminUser = async () => {
    const adminEmail = 'sbudamalloya@gmail.com';
    const adminPassword = '123456';
    const role = 'admin';

    try {
      // Create an admin user with specified credentials
      await createNewUser(adminEmail, adminPassword, role);
      console.log('Admin created successfully');
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  };

  // Trigger the admin creation on component mount
  useEffect(() => {
    createAdminUser();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="main">
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: 'black',
              color: '#fff',
            },
          }}
        >
          <div className="hotel-logo" style={{ textAlign: 'center', padding: '20px 0', fontFamily: 'Righteous, sans-serif' }}>
            <Typography variant="h5" sx={{ color: '#fff' }}>
              Steady Hotel
            </Typography>
          </div>

          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon sx={{ color: '#fff' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/guests">
              <ListItemIcon sx={{ color: '#fff' }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Guests" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/accommodations">
              <ListItemIcon sx={{ color: '#fff' }}>
                <HotelIcon />
              </ListItemIcon>
              <ListItemText primary="Accommodations" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/rates">
              <ListItemIcon sx={{ color: '#fff' }}>
                <MonetizationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Rates" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/specials">
              <ListItemIcon sx={{ color: '#fff' }}>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Specials" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button>
              <ListItemIcon sx={{ color: '#fff' }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button>
              <ListItemIcon sx={{ color: '#fff' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Login / Logout" sx={{ color: '#fff' }} /> 

            </ListItem>
          </List>
        </Drawer>

        <div className="content">
          
          
          <div className="main-content">
            {/* <Typography variant="h4" sx={{ marginBottom: 4 }}>
              {getPageTitle()}
            </Typography> */}

            {/* Accommodations Button */}
            <Button variant="contained" color="primary" onClick={handleClickOpenAccommodationDialog}>
              Add Accommodation
            </Button>

            {/* Booking Button */}
            <Button variant="contained" color="secondary" onClick={handleClickOpenBookingDialog}>
              Add Booking
            </Button>

            {/* Add Accommodation Dialog */}
            <Dialog open={openAccommodationDialog} onClose={handleCloseAccommodationDialog}>
              <DialogTitle>Add New Accommodation</DialogTitle>
              <DialogContent>
                <TextField
                  name="name"
                  label="Accommodation Name"
                  value={accommodationData.name}
                  onChange={handleAccommodationChange}
                  fullWidth
                />
                <TextField
                  name="description"
                  label="Description"
                  value={accommodationData.description}
                  onChange={handleAccommodationChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mt: 2 }}
                />
                <TextField
                  name="price"
                  label="Price per Night"
                  value={accommodationData.price}
                  onChange={handleAccommodationChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    name="availability"
                    value={accommodationData.availability}
                    onChange={handleAccommodationChange}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    name="amenities"
                    multiple
                    value={accommodationData.amenities}
                    onChange={handleAccommodationChange}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {amenitiesOptions.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        {amenity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                  Upload Images
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAccommodationDialog}>Cancel</Button>
                <Button onClick={handleAccommodationSubmit} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            {/* Add Booking Dialog */}
            <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog}>
              <DialogTitle>Add New Booking</DialogTitle>
              <DialogContent>
                <TextField
                  name="clientName"
                  label="Client Name"
                  value={bookingData.clientName}
                  onChange={handleBookingChange}
                  fullWidth
                />
                <DatePicker
                  label="Check-In Date"
                  value={bookingData.checkInDate}
                  onChange={(date) => setBookingData({ ...bookingData, checkInDate: dayjs(date) })}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TimePicker
                  label="Check-In Time"
                  value={bookingData.checkInTime}
                  onChange={(time) => setBookingData({ ...bookingData, checkInTime: time })}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <DatePicker
                  label="Check-Out Date"
                  value={bookingData.checkOutDate}
                  onChange={(date) => setBookingData({ ...bookingData, checkOutDate: dayjs(date) })}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TimePicker
                  label="Check-Out Time"
                  value={bookingData.checkOutTime}
                  onChange={(time) => setBookingData({ ...bookingData, checkOutTime: time })}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  name="accommodation"
                  label="Accommodation"
                  value={bookingData.accommodation}
                  onChange={handleBookingChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  name="numberOfGuests"
                  label="Number of Guests"
                  value={bookingData.numberOfGuests}
                  onChange={handleBookingChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseBookingDialog}>Cancel</Button>
                <Button onClick={handleBookingSubmit} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
              open={successMessage}
              autoHideDuration={6000}
              onClose={() => setSuccessMessage(false)}
            >
              <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                Accommodation added successfully!
              </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar
              open={authError}
              autoHideDuration={6000}
              onClose={() => setAuthError(false)}
            >
              <Alert onClose={() => setAuthError(false)} severity="error" sx={{ width: '100%' }}>
                Please log in to add accommodations.
              </Alert>
            </Snackbar>
          </div>

          <div className="header">
            <IconButton>
              <SearchIcon />
            </IconButton>
            <InputBase placeholder="Search" />
            <Avatar sx={{ ml: 'auto' }} />
          </div>


        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AdminDashboard;