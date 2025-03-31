import { Button, Container, Grid, IconButton, InputAdornment, Paper, TextField, Typography, Avatar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const url = "http://localhost:5000/api/v1/register";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNo: '',
        password: ''
    });

    const [user, setUser] = useState({
        name: "",
        email: "",
        phoneNo: "",
        password: "",
        profilePhoto: null
    });

    useEffect(() => {
        // Cleanup function for the preview URL
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);



    const validateField = (name, value) => {
        let error = '';

        if (name === 'name') {
            if (!value.trim()) {
                error = 'Name is required';
            } else if (value.trim().length < 3) {
                error = 'Name must be at least 3 characters long';
            } else if (!/^[A-Za-z][A-Za-z\s]*$/.test(value.trim())) {
                error = 'Name can only contain letters and spaces';
            }
        }




        if (name === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Invalid email format';
            }
        }

        if (name === 'phoneNo') {
            if (!value) {
                error = 'Phone number is required';
            } else if (!/^\+?\d{10,15}$/.test(value)) {
                error = 'Invalid phone number';
            }
        }

        if (name === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (value.length < 8) {
                error = 'Password must be at least 8 characters long';
            } else if (!/[A-Z]/.test(value)) {
                error = 'Password must contain at least one uppercase letter';
            } else if (!/[a-z]/.test(value)) {
                error = 'Password must contain at least one lowercase letter';
            } else if (!/[0-9]/.test(value)) {
                error = 'Password must contain at least one number';
            } else if (!/[@$!%*?&]/.test(value)) {
                error = 'Password must contain at least one special character (@, $, !, %, *, ?, &)';
            }
        }

        return error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            name: validateField('name', user.name),
            email: validateField('email', user.email),
            phoneNo: validateField('phoneNo', user.phoneNo),
            password: validateField('password', user.password)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            toast.error("Error: Please fix all the errors!");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("email", user.email);
            formData.append("phoneNo", user.phoneNo);
            formData.append("password", user.password);
            if (user.profilePhoto) {
                formData.append("profilePhoto", user.profilePhoto);
            }

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("User Data:", data);

            if (!response.ok) {
                throw new Error(data.message || "Registration Failed");
            }

            toast.success("Registration successful!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Error:", error.message);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // For name field, prevent multiple consecutive spaces
        let processedValue = value;
        if (name === 'name') {
            processedValue = value.replace(/\s+/g, ' ');
        }

        setUser(prev => ({
            ...prev,
            [name]: processedValue
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, processedValue)
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Cleanup old preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            // Create new preview URL
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
            setUser(prev => ({
                ...prev,
                profilePhoto: file
            }));
        }
    };

    const getInitials = (name) => {
        return name
            .trim() // Remove leading/trailing spaces
            .split(/\s+/) // Handle multiple spaces
            .filter(n => n) // Remove empty parts
            .map(n => n[0].toUpperCase())
            .join("");
    };
    

    return (
        <>
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                position="absolute"
                top="30%"
                left="30%"
                height="100vh"
                component={Paper}
                elevation={6}
                square
                textAlign="center"
            >
                <Container maxWidth="sm" component="form" onSubmit={handleSubmit} noValidate>
                    <Typography component="h1" variant="h4" textAlign="center" mt="10px">
                        Sign Up
                    </Typography>
                    <Avatar
                        src={previewUrl}
                        sx={{ width: 100, height: 100, margin: "20px auto" }}
                    >
                        {!previewUrl && user.name && getInitials(user.name)}
                    </Avatar>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ marginLeft: "120px" }}
                    />

                    <TextField
                        label="Name"
                        autoComplete="name"
                        fullWidth
                        id="name"
                        name="name"
                        type="text"
                        margin="normal"
                        required
                        value={user.name}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === ' ' && e.target.value.endsWith(' ')) {
                                e.preventDefault();
                            }
                        }}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        inputProps={{
                            pattern: "[A-Za-z\\s]*"
                        }}
                    />
                    <TextField margin="normal" name="email" type="email" label="Email Address" autoComplete="email" fullWidth required value={user.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} />
                    <TextField margin="normal" name="phoneNo" type="tel" label="Phone No" autoComplete="tel" fullWidth required value={user.phoneNo} onChange={handleChange} error={Boolean(errors.phoneNo)} helperText={errors.phoneNo} />
                    <TextField margin="normal" name="password" type={showPassword ? "text" : "password"} fullWidth label="Password" required value={user.password} onChange={handleChange} error={Boolean(errors.password)} helperText={errors.password} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">{showPassword ? <MdVisibilityOff /> : <MdVisibility />}</IconButton></InputAdornment>) }} />
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isSubmitting} fullWidth>{isSubmitting ? "Submitting..." : "Sign Up"}</Button>
                </Container>
                <ToastContainer />
            </Grid>
        </>
    );
};

export default Register;
