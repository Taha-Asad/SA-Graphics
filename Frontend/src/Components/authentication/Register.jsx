import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography, Box, Avatar } from '@mui/material';
import React, { useState, useContext } from 'react';
import { MdVisibility, MdVisibilityOff, MdAccountCircle } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNo: '',
        password: ''
    });

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        profilePhoto: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    // Basic validation rules
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value) {
                    error = 'Name is required';
                } else if (value.length > 50) {
                    error = 'Name cannot exceed 50 characters';
                }
                break;

            case 'email':
                if (!value) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Invalid email format';
                }
                break;

            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;

            case 'phoneNo':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!/^\d{11}$/.test(value)) {
                    error = 'Phone number must be 11 digits';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const newErrors = {
            name: validateField('name', user.name),
            email: validateField('email', user.email),
            phoneNo: validateField('phoneNo', user.phoneNo),
            password: validateField('password', user.password)
        };

        setErrors(newErrors);

        // Return true if there are no errors (all error messages are empty strings)
        return !Object.values(newErrors).some(error => error);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Update user data
        setUser(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate and update errors
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUser(prev => ({
                ...prev,
                profilePhoto: file
            }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the form errors");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('📝 Registration attempt with:', {
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                password: '***'
            });

            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('phoneNo', user.phoneNo);
            if (user.profilePhoto) {
                formData.append('profilePhoto', user.profilePhoto);
            }

            const response = await axios.post(
                "http://localhost:5000/api/v1/register",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('✅ Registration response:', response.data);

            if (response.data.token) {
                // Store authentication data
                login(response.data.token, response.data.data.user);
                toast.success("Registration successful!");
                navigate("/");
            } else {
                throw new Error("Registration failed - no token received");
            }

        } catch (error) {
            console.error('❌ Registration error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            const errorMessage = error.response?.data?.message || "Registration failed";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Grid
            container
            component="main"
            sx={{
                height: '80vh',
                bgcolor: "#F4FAFD",
                padding: { xs: "60px 0", md: "80px 0" },
                position: 'relative'
            }}
        >
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
                sx={{
                    margin: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {/* Profile Preview Section */}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3
                        }}
                    >
                        <Typography variant="h5" component="h1" color={"#656565"} gutterBottom>
                            Create Account
                        </Typography>

                        {/* Avatar Preview */}
                        <Box
                            sx={{
                                position: 'relative',
                                mb: 2,
                                mt: 2
                            }}
                        >
                            <Avatar
                                src={previewUrl}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontSize: '2.5rem',
                                }}
                            >
                                {!previewUrl && (user.name ? user.name.charAt(0).toUpperCase() : <MdAccountCircle />)}
                            </Avatar>
                        </Box>

                        <Button
                            component="label"
                            variant="outlined"
                        >
                            Upload Profile Picture
                            <input
                                type="file"
                                hidden
                                name="profilePhoto"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </Button>
                    </Box>

                    {/* Form Fields */}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="name"
                            label="Full Name"
                            autoComplete="name"
                            autoFocus
                            value={user.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            value={user.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="phoneNo"
                            label="Phone Number"
                            autoComplete="tel"
                            value={user.phoneNo}
                            onChange={handleChange}
                            error={!!errors.phoneNo}
                            helperText={errors.phoneNo}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={user.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>

                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h6' textAlign={'center'}>
                                    Already have an account? <Link to={"/login"} style={{color:'#149ddd'}} >Sign In</Link>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h6' textAlign={'center'}>
                                    <Link to={"/"} style={{color:'#149ddd', textDecoration: 'none'}} >
                                        ← Back to Home
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
