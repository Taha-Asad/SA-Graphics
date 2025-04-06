import { Button, Grid, Paper, TextField, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
    const [user, setUser] = useState({ password: '', confirmPassword: '' });

    const validateField = (name, value) => {
        let error = '';
        if (!value) {
            error = `${name === 'password' ? 'Password' : 'Confirm password'} is required`;
        } else if (name === 'password' && value.length < 6) {
            error = 'Password must be at least 6 characters';
        } else if (name === 'confirmPassword' && value !== user.password) {
            error = 'Passwords do not match';
        }
        return error;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate both fields
        const passwordError = validateField('password', user.password);
        const confirmError = validateField('confirmPassword', user.confirmPassword);
        
        if (passwordError || confirmError) {
            setErrors({
                password: passwordError,
                confirmPassword: confirmError
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `http://localhost:5000/api/v1/reset-password/${token}`,
                { password: user.password }
            );

            toast.success(response.data.message || 'Password reset successful!');
            navigate('/login');
        } catch (error) {
            console.error('Reset password error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to reset password';
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
                height: '85vh',
                bgcolor: "#F4FAFD",
                padding: { xs: "80px 20px", md: "100px 40px" },
                position: 'relative',
                marginTop: { xs: 16, sm: 18 },
                marginBottom:{xs:30 , sm: 30 , md: 38}          }}
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
                        Reset Password
                    </Typography>

                    <Typography 
                        variant="body1" 
                        color="textSecondary" 
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        Please enter your new password below.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                <TextField
                    margin="normal"
                            required
                            fullWidth
                    name="password"
                            label="New Password"
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

                <TextField
                    margin="normal"
                            required
                            fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                    value={user.confirmPassword}
                    onChange={handleChange}
                            error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
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
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>

                        <Grid container justifyContent="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h6' textAlign={'center'}>
                                    Remember your password? <Link to={"/login"} style={{color:'#149ddd'}} >Sign In</Link>
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

export default ResetPassword;
