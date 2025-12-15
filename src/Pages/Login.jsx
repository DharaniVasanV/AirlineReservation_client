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
  Login as LoginIcon,
  Person,
  Lock,
  ArrowBack
} from '@mui/icons-material';
import axios from 'axios';
import './css/Login.css';

const Login = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await axios.post('http://localhost:5000/api/airline/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Box className="login-form">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => onNavigate('home')}
          sx={{ alignSelf: 'flex-start', mb: 2, color: '#1976d2' }}
        >
          Back to Home
        </Button>

        <Typography variant="h4" component="h1" className="login-title">
          <LoginIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Welcome Back
        </Typography>

        <Typography variant="body1" className="login-subtitle">
          Sign in to your SkyWings platform
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={3}>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
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
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              disabled={loading}
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3, width: '100%' }}>OR</Divider>

        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => onNavigate('signup')}
            sx={{ textDecoration: 'none', fontWeight: 600 }}
          >
            Sign up here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;