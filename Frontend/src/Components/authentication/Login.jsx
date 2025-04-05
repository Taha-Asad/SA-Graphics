import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography, Box } from '@mui/material';
import React, { useState, useContext } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

// Add request interceptor
axios.interceptors.request.use(request => {
  if (request.url.includes('/login')) {
    console.log('Login Request:', {
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers
    });
  }
  return request;
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    // Basic validation rules
    const validateField = (name, value) => {
        let error = '';
        
        if (name === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Invalid email format';
            }
        }
        
        if (name === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (value.length < 6) {
                error = 'Password must be at least 6 characters';
            }
        }
        
        return error;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate all fields before submission
        const emailError = validateField('email', user.email);
        const passwordError = validateField('password', user.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('🔑 Login attempt with:', {
                email: user.email,
                password: '***'
            });

            const response = await axios.post(
                "http://localhost:5000/api/v1/login",
                user
            );

            console.log('✅ Login response:', response.data);

            if (response.data.token) {
                login(response.data.token, response.data.data.user);
                toast.success("Login successful!");
                navigate("/");
            } else {
                throw new Error("Login failed - no token received");
            }

        } catch (error) {
            console.error('❌ Login error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            const errorMessage = error.response?.data?.message || "Login failed";
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
                padding: { xs: "60px 20px", md: "80px 40px" },
                position: 'relative',
                marginTop: { xs: "40px", sm: "60px" }
            }}
        >
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square={false}
                sx={{
                    margin: 'auto',
                    padding: { xs: '20px', sm: '30px', md: '40px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
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
                    <Typography 
                        variant="h5" 
                        component="h1" 
                        color={"#656565"} 
                        gutterBottom
                        sx={{ mb: 4 }}
                    >
                        Sign In
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={user.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
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
                            sx={{ 
                                mt: 3, 
                                mb: 2,
                                backgroundColor: '#149ddd',
                                '&:hover': {
                                    backgroundColor: '#1187c1'
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h6' textAlign={'center'}>
                                    Don't have an account? <Link to={"/register"} style={{color:'#149ddd'}} >Sign Up</Link>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h6' textAlign={'center'}>
                                    Forgot Password? <Link to={"/forgot-password"} style={{color:'#149ddd'}} >Click Here</Link>
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

export default Login;
