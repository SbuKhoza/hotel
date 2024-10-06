import React, { useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemText, ListItemIcon, Avatar, IconButton, InputBase, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert, CircularProgress, Popover
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
import './AdminDashboard.css';
import { db, storage, auth } from '../services/firebase'; // Import Firebase services
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods
import { updateProfile } from 'firebase/auth'; // Firebase Authentication

function AdminDashboard() {
  const location = useLocation();
  const [openAccommodationDialog, setOpenAccommodationDialog] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false); // Profile update dialog
  const [profileData, setProfileData] = useState({ displayName: '', email: '' }); // Admin profile data
  const [accommodationData, setAccommodationData] = useState({
    name: '',
    description: '',
    price: '',
    availability: '',
    amenities: [],
    images: [],
    frontPicture: '' // Added front picture field
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
  const [imageFiles, setImageFiles] = useState([]); // For additional images
  const [frontPictureFile, setFrontPictureFile] = useState(null); // For front picture
  const [loading, setLoading] = useState(false); // Loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for search popup
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
    setAccommodationData({ ...accommodationData, [name]: value });
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(files);
  };

  const handleFrontPictureChange = (event) => {
    setFrontPictureFile(event.target.files[0]); // Handle single front picture upload
  };

  const handleAccommodationSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loader

    try {
      // Upload front picture to Firebase Storage
      let frontPictureUrl = '';
      if (frontPictureFile) {
        const frontPictureRef = ref(storage, `accommodations/front_pictures/${frontPictureFile.name}`);
        await uploadBytes(frontPictureRef, frontPictureFile);
        frontPictureUrl = await getDownloadURL(frontPictureRef);
      }

      // Upload additional images to Firebase Storage
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const storageRef = ref(storage, `accommodations/${file.name}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      // Save accommodation data to Firestore
      await addDoc(collection(db, 'accommodations'), {
        ...accommodationData,
        images: imageUrls,
        frontPicture: frontPictureUrl, // Include the front picture URL
        createdAt: new Date(),
      });

      clearAccommodationForm();
      handleCloseAccommodationDialog();
      setSuccessMessage(true);
    } catch (error) {
      console.error('Error saving accommodation: ', error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loader

    try {
      clearBookingForm();
      handleCloseBookingDialog();
    } catch (error) {
      console.error('Error saving booking: ', error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const clearAccommodationForm = () => {
    setAccommodationData({
      name: '',
      description: '',
      price: '',
      availability: '',
      amenities: [],
      images: [],
      frontPicture: ''
    });
    setImageFiles([]);
    setFrontPictureFile(null); // Reset the front picture field
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

  const handleProfileClick = () => {
    setProfileData({ displayName: auth.currentUser?.displayName || '', email: auth.currentUser?.email || '' });
    setOpenProfileDialog(true);
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        email: profileData.email,
      });
      setSuccessMessage(true);
      setOpenProfileDialog(false);
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate search results for the example
      setSearchResults(['Result 1', 'Result 2', 'Result 3']);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setAnchorEl(null);
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

            <ListItem button component={Link} to="/bookings">
              <ListItemIcon sx={{ color: '#fff' }}>
                <MonetizationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Bookings" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button component={Link} to="/discounts">
              <ListItemIcon sx={{ color: '#fff' }}>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Discounts" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button>
              <ListItemIcon sx={{ color: '#fff' }}>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button onClick={handleProfileClick}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <Avatar sx={{ width: 24, height: 24 }}>
                  {auth.currentUser?.displayName?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={auth.currentUser?.displayName || 'Admin'} sx={{ color: '#fff' }} />
            </ListItem>

            <ListItem button>
              <ListItemIcon sx={{ color: '#fff' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#fff' }} />
            </ListItem>
          </List>
        </Drawer>

        <div className="content">
          <div className="button-container">
            <Button variant="contained" color="primary" onClick={handleClickOpenAccommodationDialog}>
              Add Accommodation
            </Button>
            <Button variant="contained" color="primary" onClick={handleClickOpenBookingDialog}>
              Add Booking
            </Button>
          </div>

          <header className="header">
            <div className="search-container">
              <div className="search-bar">
                <SearchIcon sx={{ marginRight: 1 }} />
                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={handleSearchClick}
                />
              </div>

              {/* Popover for search results */}
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleSearchClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <List>
                  {searchResults.map((result, index) => (
                    <ListItem button key={index}>
                      <ListItemText primary={result} />
                    </ListItem>
                  ))}
                </List>
              </Popover>

              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </div>
          </header>

          {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

          {/* Accommodation Dialog */}
          <Dialog open={openAccommodationDialog} onClose={handleCloseAccommodationDialog}>
            <DialogTitle>Add Accommodation</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="name"
                value={accommodationData.name}
                onChange={handleAccommodationChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={accommodationData.description}
                onChange={handleAccommodationChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Price (R)"
                name="price"
                value={accommodationData.price}
                onChange={handleAccommodationChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Availability"
                name="availability"
                value={accommodationData.availability}
                onChange={handleAccommodationChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Amenities</InputLabel>
                <Select
                  label="Amenities"
                  name="amenities"
                  value={accommodationData.amenities}
                  onChange={handleAccommodationChange}
                  multiple
                >
                  {amenitiesOptions.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      {amenity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Front picture upload field */}
              <input type="file" accept="image/*" onChange={handleFrontPictureChange} />
              
              {/* Additional images upload field */}
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAccommodationDialog}>Cancel</Button>
              <Button onClick={handleAccommodationSubmit} color="primary" disabled={loading}>
                Add Accommodation
              </Button>
            </DialogActions>
          </Dialog>

          {/* Booking Dialog */}
          <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog}>
            <DialogTitle>Add Booking</DialogTitle>
            <DialogContent>
              <TextField
                label="Client Name"
                name="clientName"
                value={bookingData.clientName}
                onChange={handleBookingChange}
                fullWidth
                margin="normal"
              />
              <DatePicker
                label="Check-in Date"
                value={bookingData.checkInDate}
                onChange={(date) => setBookingData({ ...bookingData, checkInDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <TimePicker
                label="Check-in Time"
                value={bookingData.checkInTime}
                onChange={(time) => setBookingData({ ...bookingData, checkInTime: time })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <DatePicker
                label="Check-out Date"
                value={bookingData.checkOutDate}
                onChange={(date) => setBookingData({ ...bookingData, checkOutDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <TimePicker
                label="Check-out Time"
                value={bookingData.checkOutTime}
                onChange={(time) => setBookingData({ ...bookingData, checkOutTime: time })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <TextField
                label="Accommodation"
                name="accommodation"
                value={bookingData.accommodation}
                onChange={handleBookingChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Number of Guests"
                name="numberOfGuests"
                value={bookingData.numberOfGuests}
                onChange={handleBookingChange}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseBookingDialog}>Cancel</Button>
              <Button onClick={handleBookingSubmit} color="primary" disabled={loading}>
                Add Booking
              </Button>
            </DialogActions>
          </Dialog>

          {/* Profile Dialog */}
          <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)}>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogContent>
              <TextField
                label="Display Name"
                name="displayName"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProfileDialog(false)}>Cancel</Button>
              <Button onClick={handleProfileUpdate} color="primary" disabled={loading}>
                Update Profile
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage(false)}
          >
            <Alert severity="success">Operation successful!</Alert>
          </Snackbar>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AdminDashboard;
