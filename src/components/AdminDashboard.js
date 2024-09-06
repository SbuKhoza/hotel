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
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <div className="main">
      {/* Sidebar (sidedash) */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250, 
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: '#1E293B', 
            color: '#fff', 
          },
        }}
      >
        {/* Hotel name as the logo */}
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
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button component={Link} to="/guests">
            <ListItemIcon sx={{ color: '#fff' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Guests" />
          </ListItem>

          <ListItem button component={Link} to="/accommodations">
            <ListItemIcon sx={{ color: '#fff' }}>
              <HotelIcon />
            </ListItemIcon>
            <ListItemText primary="Accommodations" />
          </ListItem>

          <ListItem button component={Link} to="/rates">
            <ListItemIcon sx={{ color: '#fff' }}>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Rates" />
          </ListItem>

          <ListItem button component={Link} to="/specials">
            <ListItemIcon sx={{ color: '#fff' }}>
              <LocalOfferIcon />
            </ListItemIcon>
            <ListItemText primary="Specials" />
          </ListItem>

          {/* Logout Button */}
          <ListItem button component={Link} to="/logout">
            <ListItemIcon sx={{ color: '#fff' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main container */}
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

        {/* Search bar */}
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