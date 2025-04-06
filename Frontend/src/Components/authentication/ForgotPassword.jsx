import { Button, Grid, Paper, TextField, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        if (!email) {
            return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Invalid email format';
        }
        return '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const emailError = validateEmail(email);
        
        if (emailError) {
            setError(emailError);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/forgot-password',
                { email }
            );

            toast.success(response.data.message || 'Reset link sent to your email!');
            setEmail('');
            setError('');
        } catch (error) {
            console.error('Forgot password error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to send reset link';
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
                marginTop: { xs: 20, sm: 20 },
                marginBottom:{xs:10 , sm: 10 , md: 30}
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
                        Forgot Password
                    </Typography>

                    <Typography 
                        variant="body1" 
                        color="textSecondary" 
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        Enter your email address and we'll send you a link to reset your password.
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
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(validateEmail(e.target.value));
                            }}
                            error={!!error}
                            helperText={error}
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
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
