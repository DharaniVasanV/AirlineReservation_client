import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Container
} from '@mui/material';
import {
  FlightTakeoff,
  Login,
  PersonAdd,
  Star,
  Security,
  Support
} from '@mui/icons-material';
import './css/Home.css';

const Home = ({ onNavigate }) => {
  const features = [
    {
      icon: <FlightTakeoff sx={{ fontSize: 40 }} />,
      title: 'Easy Booking',
      description: 'Book your flights in just a few clicks with our user-friendly interface.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      description: 'Your transactions are protected with industry-standard security measures.'
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you.'
    }
  ];

  return (
    <Box className="home-container">
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box className="hero-section">
          <Typography variant="h2" component="h1" className="hero-title">
            Welcome to SkyWings
          </Typography>
          <Typography variant="h5" className="hero-subtitle">
            Your Flight Booking Platform
          </Typography>
          <Typography variant="body1" className="hero-description">
            Book flights from multiple airlines with our modern reservation platform. 
            Compare prices, find the best deals, and manage your bookings all in one place.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} className="hero-buttons">
            <Button
              variant="contained"
              size="large"
              startIcon={<Login />}
              onClick={() => onNavigate('login')}
              sx={{ py: 2, px: 4 }}
            >
              Login to Your Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => onNavigate('signup')}
              sx={{ py: 2, px: 4, color: 'white', borderColor: 'white' }}
            >
              Create New Account
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Box className="features-section">
          <Typography variant="h4" component="h2" className="section-title">
            Why Choose Our Platform?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className="feature-card">
                  <CardContent className="feature-content">
                    <Box className="feature-icon">
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box className="stats-section">
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Box className="stat-item">
                <Typography variant="h3" className="stat-number">50+</Typography>
                <Typography variant="body1">Destinations</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box className="stat-item">
                <Typography variant="h3" className="stat-number">1M+</Typography>
                <Typography variant="body1">Happy Customers</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box className="stat-item">
                <Typography variant="h3" className="stat-number">99%</Typography>
                <Typography variant="body1">On-time Performance</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box className="stat-item">
                <Typography variant="h3" className="stat-number">24/7</Typography>
                <Typography variant="body1">Customer Support</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;