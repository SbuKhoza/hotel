import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemText, ListItemIcon, Avatar, IconButton, InputBase, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl
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
    amenities: [], // Initialize as an array
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
        createdAt: new Date()
      });

      clearAccommodationForm();
      handleCloseAccommodationDialog();
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
      default:
        return 'Admin Dashboard';
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
        role,  // e.g., 'admin' or 'user'
        createdAt: new Date()
      });

      console.log('User created and saved in Firestore');
    } catch (error) {
      console.error('Error creating new user:', error);
    }
  };

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

            <ListItem button component={Link} to="/users">
              <ListItemIcon sx={{ color: '#fff' }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/reservations">
              <ListItemIcon sx={{ color: '#fff' }}>
                <HotelIcon />
              </ListItemIcon>
              <ListItemText primary="Reservations" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/logout">
              <ListItemIcon sx={{ color: '#fff' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#fff' }} />
            </ListItem>
          </List>
        </Drawer>

        <div className="container">
          <div className="top-bar">
            <div className="top-left">
              <Typography variant="h6">{getPageTitle()}</Typography>
              <IconButton size="large">
                <SearchIcon />
              </IconButton>
              <InputBase placeholder="Search..." />
            </div>
            <div className="top-right">
              <IconButton size="large">
                <NotificationsIcon />
              </IconButton>
              <IconButton size="large">
                <Avatar alt="User Avatar" />
              </IconButton>
            </div>
          </div>

          <div className="content">
            <Button onClick={handleClickOpenAccommodationDialog} variant="contained" color="primary">Add Accommodation</Button>
            <Button onClick={handleClickOpenBookingDialog} variant="contained" color="secondary">Add Booking</Button>

            <Dialog open={openAccommodationDialog} onClose={handleCloseAccommodationDialog}>
              <DialogTitle>Add Accommodation</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  name="name"
                  label="Accommodation Name"
                  fullWidth
                  value={accommodationData.name}
                  onChange={handleAccommodationChange}
                />
                <TextField
                  margin="dense"
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={accommodationData.description}
                  onChange={handleAccommodationChange}
                />
                <TextField
                  margin="dense"
                  name="price"
                  label="Price"
                  fullWidth
                  value={accommodationData.price}
                  onChange={handleAccommodationChange}
                />
                <TextField
                  margin="dense"
                  name="availability"
                  label="Availability"
                  fullWidth
                  value={accommodationData.availability}
                  onChange={handleAccommodationChange}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    value={accommodationData.amenities}
                    name="amenities"
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
                <input type="file" multiple onChange={handleFileChange} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAccommodationDialog}>Cancel</Button>
                <Button onClick={handleAccommodationSubmit} color="primary">Submit</Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog}>
              <DialogTitle>Add Booking</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  name="clientName"
                  label="Client Name"
                  fullWidth
                  value={bookingData.clientName}
                  onChange={handleBookingChange}
                />
                <DatePicker
                  label="Check-In Date"
                  value={bookingData.checkInDate}
                  onChange={(date) => handleBookingChange({ target: { name: 'checkInDate', value: dayjs(date) } })}
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
                <TimePicker
                  label="Check-In Time"
                  value={bookingData.checkInTime}
                  onChange={(time) => handleBookingChange({ target: { name: 'checkInTime', value: dayjs(time) } })}
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
                <DatePicker
                  label="Check-Out Date"
                  value={bookingData.checkOutDate}
                  onChange={(date) => handleBookingChange({ target: { name: 'checkOutDate', value: dayjs(date) } })}
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
                <TimePicker
                  label="Check-Out Time"
                  value={bookingData.checkOutTime}
                  onChange={(time) => handleBookingChange({ target: { name: 'checkOutTime', value: dayjs(time) } })}
                  renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                />
                <TextField
                  margin="dense"
                  name="numberOfGuests"
                  label="Number of Guests"
                  fullWidth
                  value={bookingData.numberOfGuests}
                  onChange={handleBookingChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseBookingDialog}>Cancel</Button>
                <Button onClick={handleBookingSubmit} color="primary">Submit</Button>
              </DialogActions>
            </Dialog>

            {/* Example button to create new users */}
            <Button onClick={() => createNewUser('admin@example.com', 'password123', 'admin')} variant="contained">
              Create Admin
            </Button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AdminDashboard;