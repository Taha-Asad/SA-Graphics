import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams(); // Get token from URL
    const url = `http://localhost:5000/api/v1/reset-password/${token}`
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
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
        if (!user.password || user.password !== user.confirmPassword) {
            toast.error("Passwords do not match or are empty");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: user.password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Reset failed");
            toast.success("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            toast.error(error.message || "Reset failed. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Grid item xs={12} sm={8} md={5} position="absolute" top="30%" left="30%" height="50vh" component={Paper} elevation={6} square>
            <Container maxWidth="sm" component="form" onSubmit={handleSubmit} noValidate>
                <Typography component="h1" variant="h4" textAlign="center" mt="30px">Reset Password</Typography>
                
                <TextField
                    margin="normal"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    placeholder="New Password"
                    label="New Password"
                    required
                    value={user.password}
                    onChange={handleChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="normal"
                    name="confirmPassword"
                    type="password"
                    fullWidth
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    required
                    value={user.confirmPassword}
                    onChange={handleChange}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                />

                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isSubmitting} fullWidth>
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
            </Container>
            <ToastContainer />
        </Grid>
    );
};

export default ResetPassword;
