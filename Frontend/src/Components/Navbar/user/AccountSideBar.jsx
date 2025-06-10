import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Button, 
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Paper,
  Skeleton,
  Alert,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  CircularProgress,
  Slide
} from "@mui/material";
import { FiPackage, FiTruck, FiHeart, FiEdit2, FiUpload, FiHome } from "react-icons/fi";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { MdSecurity, MdReviews, MdClose, MdDashboard } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { BsPerson } from 'react-icons/bs';
import { toast } from 'react-toastify';

const AccountSideBar = ({ onClose, open }) => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    orders: 0,
    reviews: 0,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePic: null
  });
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '');

  // Fetch user stats from backend
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user stats for user:', user._id);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/v1/users/stats', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Received user stats:', response.data);
        setUserStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Detailed error fetching user stats:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to load user statistics');
        toast.error('Failed to load user statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setEditFormData({
        name: user.name || '',
        email: user.email || '',
        profilePic: null
      });
    }
  }, [user]);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setEditFormData(prev => ({
        ...prev,
        profilePic: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('email', editFormData.email);
      if (editFormData.profilePic) {
        formData.append('profilePic', editFormData.profilePic);
      }

      console.log('Sending form data:', {
        name: editFormData.name,
        email: editFormData.email,
        hasProfilePic: !!editFormData.profilePic
      });

      const response = await axios.put(
        'http://localhost:5000/api/v1/settings/profile',
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        console.log('Profile update response:', response.data);
        // Update the preview URL with the new image URL
        if (response.data.profilePic) {
          setPreviewUrl(response.data.profilePic);
        }
        updateUser(response.data);
        toast.success('Profile updated successfully');
        handleEditDialogClose();
      }
    } catch (err) {
      console.error('Detailed error updating profile:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      toast.error(
        err.response?.data?.message || 
        err.response?.statusText || 
        'Failed to update profile'
      );
    } finally {
      setUploading(false);
    }
  };

  // Update previewUrl when user changes
  useEffect(() => {
    if (user?.profilePic) {
      setPreviewUrl(user.profilePic);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    logout();
    if (onClose) onClose();
    navigate('/');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Error logging out:', err);
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Dynamic menu items based on user role
  const getMenuItems = () => {
    const items = [
      // {
      //   icon: <BsPerson size={20} />,
      //   text: 'Profile',
      //   path: '/account/profile'
      // },
      {
        icon: <FiPackage size={20} />,
        text: 'Orders',
        path: '/account/orders'
      },
      {
        icon: <MdReviews size={20} />,
        text: 'Reviews',
        path: '/account/reviews'
      },
      {
        icon: <MdSecurity size={20} />,
        text: 'Security',
        path: '/account/security'
      },
      {
        icon: <RiCustomerService2Line size={20} />,
        text: 'Support',
        path: '/account/support'
      }
    ];

    // Add admin dashboard link for admin users
    if (user?.role === 'admin') {
      items.unshift({
        icon: <MdDashboard size={20} />,
        text: 'Admin Dashboard',
        path: '/admin/dashboard'
      });
    }

    return items;
  };

  return (
    <Slide direction="left" in={open} timeout={600} mountOnEnter unmountOnExit>
      <Box
        sx={{
      height: '100vh',
          width: '320px',
      position: 'fixed',
      right: 0,
      top: 0,
          backgroundColor: '#1a1a1a',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Typography variant="h6" sx={{ 
            color: 'white', 
          fontFamily: 'Raleway',
          fontWeight: 500,
            letterSpacing: '0.5px'
        }}>
          Account
        </Typography>
          <IconButton
            onClick={onClose}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            <MdClose />
          </IconButton>
        </Box>

        {/* Error Message */}
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Collapse>

        {user ? (
          <>
            {/* User Profile Section */}
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative'
              }}
            >
              <IconButton
                onClick={handleEditDialogOpen}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: 'rgba(255, 255, 255, 0.85)',
                  '&:hover': {
                    color: '#149ddd',
                    backgroundColor: 'rgba(20, 157, 221, 0.08)'
                  }
                }}
              >
                <FiEdit2 size={18} />
              </IconButton>
              <Avatar
                src={user?.profilePic || ''}
                alt={user?.name}
              sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  mb: 2,
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                {!user?.profilePic && <BsPerson size={40} />}
              </Avatar>
              <Typography variant="h6" sx={{ 
                color: 'white', 
                mb: 0.5,
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.85rem'
              }}>
                {user.email}
              </Typography>
            </Box>

            {/* Edit Profile Dialog */}
            <Dialog 
              open={editDialogOpen} 
              onClose={handleEditDialogClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  minWidth: '300px'
                }
              }}
            >
              <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                Edit Profile
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                {/* Profile Picture Upload */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Avatar
                    src={previewUrl || ''}
                    alt={editFormData.name}
                    sx={{
                      width: 100,
                      height: 100,
              mb: 2,
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {!previewUrl && <BsPerson size={50} />}
                  </Avatar>
            <Button
                    component="label"
                    variant="outlined"
                    startIcon={<FiUpload />}
              sx={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                '&:hover': {
                        borderColor: '#149ddd',
                        color: '#149ddd',
                        backgroundColor: 'rgba(20, 157, 221, 0.08)'
                      }
                    }}
                  >
                    Upload Photo
                    <Input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
            </Button>
                </Box>

                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  margin="normal"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  margin="normal"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button
                  onClick={handleEditDialogClose}
                  disabled={uploading}
              sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                '&:hover': {
                      color: '#149ddd',
                      backgroundColor: 'rgba(20, 157, 221, 0.08)'
                    }
                  }}
                >
                  Cancel
            </Button>
            <Button
                  onClick={handleEditSubmit}
                  variant="contained"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : null}
              sx={{
                    backgroundColor: '#149ddd',
                    color: 'white',
                '&:hover': {
                      backgroundColor: '#1187c1',
                },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(20, 157, 221, 0.5)',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
              }}
            >
                  {uploading ? 'Saving...' : 'Save Changes'}
            </Button>
              </DialogActions>
            </Dialog>

            {/* Main Menu */}
            <List sx={{ 
              flex: 1, 
              overflow: 'auto', 
              px: 2,
              py: 1,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.02)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
              },
            }}>
              {getMenuItems().map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={onClose}
                    sx={{
                      borderRadius: 1,
                      color: 'rgba(255, 255, 255, 0.85)',
                '&:hover': {
                      backgroundColor: 'rgba(20, 157, 221, 0.08)',
                      color: '#149ddd',
                    }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      color: 'rgba(255, 255, 255, 0.7)',
                      '& svg': { fontSize: '1.2rem' }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.95rem',
                          fontWeight: 400,
                          letterSpacing: '0.2px'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {/* Account Stats */}
            <Paper
              sx={{
                m: 2,
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
            <Typography variant="subtitle2" sx={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                mb: 1.5,
                fontSize: '0.75rem',
              letterSpacing: '1px',
                fontWeight: 500
              }}>
                ACCOUNT OVERVIEW
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {loading ? (
                  <>
                    <Skeleton variant="rectangular" width={80} height={50} />
                    <Skeleton variant="rectangular" width={80} height={50} />
                    <Skeleton variant="rectangular" width={80} height={50} />
                  </>
                ) : (
                  <>
                    <Box 
                      component={Link}
                      to="/account/orders"
                      onClick={onClose}
                      sx={{
                        textAlign: 'center',
                        textDecoration: 'none',
                        flex: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          '& .stat-number': { color: '#149ddd' }
                        }
                      }}
                    >
                      <Typography 
                        className="stat-number"
                        variant="h6" 
                        sx={{ 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.5rem',
                          mb: 0.5,
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {userStats.orders}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          display: 'block'
                        }}
                      >
                        Orders
            </Typography>
                    </Box>

                    <Box 
                      component={Link}
                      to="/account/reviews"
                      onClick={onClose}
                      sx={{
                        textAlign: 'center',
                        textDecoration: 'none',
                        flex: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          '& .stat-number': { color: '#149ddd' }
                        }
                      }}
                    >
                      <Typography 
                        className="stat-number"
                        variant="h6" 
                        sx={{ 
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.5rem',
                          mb: 0.5,
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {userStats.reviews}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          display: 'block'
                        }}
                      >
                        Reviews
                      </Typography>
                    </Box>


                  </>
                )}
              </Box>
            </Paper>

            {/* Logout Button */}
            <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Button
                fullWidth
                variant="contained"
              onClick={handleLogout}
                startIcon={<BiLogOut />}
              sx={{
                  backgroundColor: '#149ddd',
                  color: 'white',
                  py: 1,
                '&:hover': {
                    backgroundColor: '#1187c1',
                  }
              }}
            >
                Logout
            </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              to="/login"
              onClick={onClose}
              startIcon={<BiLogIn />}
              sx={{
                backgroundColor: '#149ddd',
                color: 'white',
                py: 1,
                '&:hover': {
                  backgroundColor: '#1187c1',
                }
              }}
            >
              Login
            </Button>
          </Box>
        )}
      </Box>
    </Slide>
  );
};

export default AccountSideBar;