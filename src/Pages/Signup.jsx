import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  Link,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd,
  Person,
  Email,
  Lock,
  Phone,
  ArrowBack
} from '@mui/icons-material';
import axios from 'axios';
import './css/Signup.css';

const Signup = ({ onNavigate, onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await axios.post('http://localhost:5000/api/airline/register', signupData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onSignup(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="signup-container">
      <Box className="signup-form">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => onNavigate('home')}
          sx={{ alignSelf: 'flex-start', mb: 2, color: '#1976d2' }}
        >
          Back to Home
        </Button>

        <Typography variant="h4" component="h1" className="signup-title">
          <PersonAdd sx={{ mr: 2, verticalAlign: 'middle' }} />
          Join SkyWings
        </Typography>

        <Typography variant="body1" className="signup-subtitle">
          Create your account to start booking flights
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              helperText="Minimum 6 characters"
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
              disabled={loading}
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3, width: '100%' }}>OR</Divider>

        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => onNavigate('login')}
            sx={{ textDecoration: 'none', fontWeight: 600 }}
          >
            Sign in here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;