import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, CheckCircle as UnblockIcon, Person as PersonIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getUsers, updateUser, deleteUser, blockUser, unblockUser } from '../../services/adminService';

const BASE_URL = 'http://localhost:5000';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, userId: null });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(page + 1, rowsPerPage);
      if (data && data.users) {
        setUsers(data.users);
        setTotalUsers(data.total || 0);
      } else {
        setUsers([]);
        setError('No users data received');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setError(err.message || 'Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(selectedUser._id, selectedUser);
      toast.success('User updated successfully');
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(confirmDialog.userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    } finally {
      setConfirmDialog({ open: false, type: null, userId: null });
    }
  };

  const handleBlockConfirm = async () => {
    try {
      if (confirmDialog.type === 'block') {
        await blockUser(confirmDialog.userId);
        toast.success('User blocked successfully');
      } else {
        await unblockUser(confirmDialog.userId);
        toast.success('User unblocked successfully');
      }
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error(`Failed to ${confirmDialog.type} user`);
    } finally {
      setConfirmDialog({ open: false, type: null, userId: null });
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ open: false, type: null, userId: null });
  };

  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return null;
    if (profilePic.startsWith('http')) return profilePic;
    return `${BASE_URL}/uploads/${profilePic}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          User Management
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={fetchUsers}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        User Management
      </Typography>

      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow hover key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={getProfilePicUrl(user.profilePic)} 
                          alt={user.name}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: user.profilePic ? 'transparent' : 'primary.main'
                          }}
                        >
                          {!user.profilePic && <PersonIcon />}
                        </Avatar>
                        <Typography>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setConfirmDialog({ open: true, type: 'delete', userId: user._id })}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color={user.status === 'active' ? 'warning' : 'success'}
                        size="small"
                        onClick={() => setConfirmDialog({ 
                          open: true, 
                          type: user.status === 'active' ? 'block' : 'unblock', 
                          userId: user._id 
                        })}
                      >
                        {user.status === 'active' ? <BlockIcon /> : <UnblockIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {users && users.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={selectedUser?.name || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedUser?.role || ''}
                label="Role"
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
        <DialogTitle>
          {confirmDialog.type === 'delete' ? 'Delete User' : 
           confirmDialog.type === 'block' ? 'Block User' : 'Unblock User'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.type === 'delete' ? 
              'Are you sure you want to delete this user? This action cannot be undone.' :
              confirmDialog.type === 'block' ?
              'Are you sure you want to block this user?' :
              'Are you sure you want to unblock this user?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          <Button 
            onClick={confirmDialog.type === 'delete' ? handleDeleteConfirm : handleBlockConfirm}
            color={confirmDialog.type === 'delete' ? 'error' : 'primary'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users; 