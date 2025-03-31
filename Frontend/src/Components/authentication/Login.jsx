import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React, { useState, useContext } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
const url = "http://localhost:5000/api/v1/login"
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
          console.log("Submitting login with:", {
            email: user.email,
            password: user.password
          });
      
          const response = await fetch(url , {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email.trim(), // Trim email
              password: user.password // Don't trim password
            }),
          });
      
          const data = await response.json();
          console.log("Login Response:", data);
      
          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }
      
          if (!data.token || !data.user) {
            throw new Error("Invalid server response format");
          }
      
          // Store authentication
          login(data.token, data.user);
      
          toast.success("Login successful!");
          setTimeout(() => navigate("/"), 1500);
      
        } catch (error) {
          console.error("Login Error Details:", {
            message: error.message,
            email: user.email,
            stack: error.stack
          });
          toast.error(error.message || "Login failed. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      };


    return (
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
                
                {/* Email Field */}
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
                
                {/* Password Field */}
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
                <Typography variant='h6' textAlign={'center'}>Don't have a account <Link to={"/register"} style={{color:'#149ddd'}} >Sign Up</Link></Typography>
                <Typography variant='h6' textAlign={'center'}>Forgot Password <Link to={"/forgot-password"} style={{color:'#149ddd'}} >Click Here</Link></Typography>
            </Container>
            <ToastContainer/>
        </Grid>
    );
};

export default Login;
