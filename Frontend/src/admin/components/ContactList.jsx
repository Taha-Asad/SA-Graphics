import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/v1/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Contact API Response:', response.data); // Debug log
      
      // Handle the response based on the actual structure
      const contactData = response.data.data || response.data;
      setContacts(Array.isArray(contactData) ? contactData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err.response || err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch contacts';
      setError(errorMessage);
      toast.error(errorMessage);
      setContacts([]); // Ensure contacts is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.delete(`/api/v1/admin/contacts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
        toast.success('Contact deleted successfully');
      } catch (err) {
        console.error('Error deleting contact:', err.response || err);
        const errorMessage = err.response?.data?.message || 'Failed to delete contact';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Form Submissions
      </Typography>
      
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {contacts.length === 0 ? (
        <Box mt={2}>
          <Alert severity="info">No contact form submissions found.</Alert>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id || contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.subject}</TableCell>
                  <TableCell>
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleView(contact)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(contact._id || contact.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Details</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Name:</strong> {selectedContact.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {selectedContact.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Subject:</strong> {selectedContact.subject}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Message:</strong>
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedContact.message}
              </Typography>
              {selectedContact.createdAt && (
                <Typography variant="subtitle2" color="textSecondary">
                  Submitted on: {new Date(selectedContact.createdAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactList; 