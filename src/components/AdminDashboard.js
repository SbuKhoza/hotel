import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Avatar, IconButton, InputBase, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import './AdminDashboard.css';

function AdminDashboard() {
  const location = useLocation();

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
        return 'Users'; // Add case for Users page
      case '/reservations':
        return 'Reservations'; // Add case for Reservations page
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

          {/* Add Users link */}
          <ListItem button component={Link} to="/users">
            <ListItemIcon sx={{ color: '#fff' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" sx={{ color: '#fff' }} />
          </ListItem>

          {/* Add Reservations link */}
          <ListItem button component={Link} to="/reservations">
            <ListItemIcon sx={{ color: '#fff' }}>
              <HotelIcon />
            </ListItemIcon>
            <ListItemText primary="Reservations" sx={{ color: '#fff' }} />
          </ListItem>

          {/* Logout Button */}
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
            placeholder="Search for rooms"
            inputProps={{ 'aria-label': 'search' }}
            sx={{
              border: '1px solid #ccc',
              padding: '0 10px',
              borderRadius: '4px',
              width: '300px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;