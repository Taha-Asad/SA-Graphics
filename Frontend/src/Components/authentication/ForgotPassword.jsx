import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const url = "http://localhost:5000/api/v1/forgot-password";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (value) => {
        if (!value) {
            return 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Invalid email format';
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            toast.error(emailError);
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset email");
            }
            
            toast.success("Password reset email sent!");
        } catch (error) {
            toast.error(error.message || "Error sending reset email");
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
            height="50vh"
            component={Paper}
            elevation={6}
            square
        >
            <Container maxWidth="sm" component="form" onSubmit={handleSubmit} noValidate>
                <Typography component="h1" variant="h4" textAlign="center" mt="30px">
                    Forgot Password
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
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(validateEmail(e.target.value));
                    }}
                    error={Boolean(error)}
                    helperText={error}
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={isSubmitting}
                    fullWidth
                >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <Typography variant='h6' textAlign={'center'}>
                    Remember your password? <Link to={"/login"} style={{ color: '#149ddd' }}>Sign In</Link>
                </Typography>
            </Container>
            <ToastContainer />
        </Grid>
    );
};

export default ForgotPassword;
