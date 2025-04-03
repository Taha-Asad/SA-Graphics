import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React, { useState, useContext } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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

    const validateForm = () => {
        const newErrors = {
            email: validateField('email', user.email),
            password: validateField('password', user.password)
        };
        
        setErrors(newErrors);
        
        return !newErrors.email && !newErrors.password;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        if (!validateForm()) {
          toast.error("Please fix the form errors");
          return;
        }
      
        setIsSubmitting(true);
      
        try {
          console.log("Attempting login for:", user.email);
          
          // Log the exact request data
          const requestData = {
            email: user.email.trim(),
            password: user.password
          };
          console.log("Request data:", requestData);
      
          const response = await axios.post("http://localhost:5000/api/v1/login", requestData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          console.log("Full response:", response);
          console.log("Login response data:", response.data);
      
          const { token, user: userData } = response.data;
      
          if (!token || !userData) {
            console.error("Invalid response structure:", response.data);
            throw new Error("Invalid response from server");
          }

          // Log the user data before storing
          console.log("User data before login:", userData);
      
          // Store authentication data
          login(token, userData);
      
          toast.success("Login successful!");
          
          // Redirect based on user role
          if (userData.role === "admin") {
            setTimeout(() => navigate("/admin"), 1500);
          } else {
            setTimeout(() => navigate("/"), 1500);
          }
      
        } catch (error) {
          console.error("Login error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          
          // Handle different types of errors
          if (error.response) {
            // Server responded with an error
            const errorMessage = error.response.data.message || "Invalid email or password";
            console.log("Server error response:", error.response.data);
            toast.error(errorMessage);
          } else if (error.request) {
            // No response received
            console.log("Network error: No response received");
            toast.error("Unable to connect to server. Please try again later.");
          } else {
            // Other errors
            console.log("Other error:", error.message);
            toast.error(error.message || "An error occurred. Please try again.");
          }
        } finally {
          setIsSubmitting(false);
        }
    };

    return (
        <Grid
            container
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                position="absolute"
                top="30%"
                left="30%"
                height="60vh"
                component={Paper}
                elevation={6}
                square
            >
                <Container maxWidth="sm" component="form" onSubmit={handleSubmit} noValidate>
                    <Typography component="h1" variant="h4" textAlign="center" mt="30px">
                        Sign In
                    </Typography>
                    
                    <TextField
                        margin="normal"
                        name="email"
                        placeholder="Email"
                        type="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        fullWidth
                        required
                        value={user.email}
                        onChange={handleChange}
                        onBlur={() => setErrors(prev => ({
                            ...prev,
                            email: validateField('email', user.email)
                        }))}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                    
                    <TextField
                        margin="normal"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        placeholder="Password"
                        label="Password"
                        required
                        value={user.password}
                        onChange={handleChange}
                        onBlur={() => setErrors(prev => ({
                            ...prev,
                            password: validateField('password', user.password)
                        }))}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton 
                                        onClick={() => setShowPassword(prev => !prev)}
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
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Typography variant='h6' textAlign={'center'}>
                        Don't have an account? <Link to={"/register"} style={{color:'#149ddd'}} >Sign Up</Link>
                    </Typography>
                    <Typography variant='h6' textAlign={'center'}>
                        Forgot Password? <Link to={"/forgot-password"} style={{color:'#149ddd'}} >Click Here</Link>
                    </Typography>
                    <Typography variant='h6' textAlign={'center'} sx={{ mt: 2 }}>
                        <Link to={"/"} style={{color:'#149ddd', textDecoration: 'none'}} >
                            ← Back to Home
                        </Link>
                    </Typography>
                </Container>
                <ToastContainer/>
            </Grid>
        </Grid>
    );
};

export default Login;
