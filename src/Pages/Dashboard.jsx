import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  FlightTakeoff,
  BookOnline,
  History,
  Logout,
  AdminPanelSettings
} from '@mui/icons-material';
import FlightSearch from './FlightSearch';
import BookingForm from './BookingForm';
import ReservationList from './ReservationList';
import AdminPanel from './AdminPanel';
import './css/Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setActiveTab('book');
  };

  const renderContent = () => {
    if (user.role === 'admin') {
      return <AdminPanel />;
    }
    
    switch (activeTab) {
      case 'search':
        return <FlightSearch onFlightSelect={handleFlightSelect} />;
      case 'book':
        return <BookingForm user={user} selectedFlight={selectedFlight} />;
      case 'reservations':
        return <ReservationList user={user} />;
      default:
        return <FlightSearch onFlightSelect={handleFlightSelect} />;
    }
  };

  return (
    <Box className="dashboard-container">
      <AppBar position="static" className="dashboard-header">
        <Toolbar>
          <FlightTakeoff sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SkyWings Platform - Welcome, {user.name}
          </Typography>
          <Button color="inherit" onClick={onLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {user.role === 'admin' ? (
            <Grid item xs={12}>
              <Card className="content-card">
                <CardContent>
                  {renderContent()}
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={3}>
                <Card className="nav-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Navigation
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant={activeTab === 'search' ? 'contained' : 'outlined'}
                        startIcon={<FlightTakeoff />}
                        onClick={() => setActiveTab('search')}
                        fullWidth
                      >
                        Search Flights
                      </Button>
                      <Button
                        variant={activeTab === 'book' ? 'contained' : 'outlined'}
                        startIcon={<BookOnline />}
                        onClick={() => setActiveTab('book')}
                        fullWidth
                      >
                        Book Flight
                      </Button>
                      <Button
                        variant={activeTab === 'reservations' ? 'contained' : 'outlined'}
                        startIcon={<History />}
                        onClick={() => setActiveTab('reservations')}
                        fullWidth
                      >
                        My Bookings
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={9}>
                <Card className="content-card">
                  <CardContent>
                    {renderContent()}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;