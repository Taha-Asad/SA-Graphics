import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  Comment as TestimonialsIcon
} from '@mui/icons-material';

const AdminNav = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/admin">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/admin/testimonials">
          <ListItemIcon>
            <TestimonialsIcon />
          </ListItemIcon>
          <ListItemText primary="Testimonials" />
        </ListItem>

        <ListItem button component={Link} to="/admin/contacts">
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary="Contact Forms" />
        </ListItem>

        <ListItem button component={Link} to="/admin/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminNav; 