import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Avatar, IconButton, InputBase, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import './AdminDashboard.css';
import { addAccommodationToFirestore } from '../services/firestoreService'; // Update the path as needed

function AdminDashboard() {
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [accommodationData, setAccommodationData] = useState({
    name: '',
    description: '',
    price: '',
    availability: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccommodationData({ ...accommodationData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    // Optional: Display a preview or convert the file to a URL if necessary
    const reader = new FileReader();
    reader.onload = () => {
      setAccommodationData({ ...accommodationData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(accommodationData);
    // Add the new accommodation to Firestore
    await addAccommodationToFirestore(accommodationData);
    setAccommodationData({
      name: '',
      description: '',
      price: '',
      availability: '',
      image: ''
    });
    setImageFile(null);
    handleCloseDialog();
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

  return (
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
            <ListItemText primary="Dashboard" sx={{ color: '#fff' }}/>
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
          <Typography variant="h5">{getPageTitle()}</Typography>
          <div>
            <IconButton>
              <NotificationsIcon sx={{ color: '#333' }} />
            </IconButton>
            <IconButton>
              <Avatar alt="Admin" src="/admin-avatar.jpg" sx={{ width: 40, height: 40 }} />
            </IconButton>
          </div>
        </div>

        <div className="search">
          <SearchIcon sx={{ marginRight: 1 }} />
          <InputBase
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            sx={{
              border: '1px solid #ccc',
              padding: '0 10px',
              borderRadius: '4px',
              width: '300px',
            }}
          />
        </div>

        <div className="top-bar-buttons">
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 1, width: '200px' }} onClick={handleClickOpenDialog}>
            Create Accommodation
          </Button>
          <Button variant="contained" color="primary" sx={{ mt: 2, width: '200px' }}>
            Create Booking
          </Button>
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Create New Accommodation</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Accommodation Name"
                type="text"
                fullWidth
                variant="outlined"
                value={accommodationData.name}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={accommodationData.description}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="price"
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                value={accommodationData.price}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="availability"
                label="Availability"
                type="number"
                fullWidth
                variant="outlined"
                value={accommodationData.availability}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="image"
                label="Image URL"
                type="text"
                fullWidth
                variant="outlined"
                value={accommodationData.image}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminDashboard;
