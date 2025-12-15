import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Flight, 
  Person, 
  Email, 
  Phone, 
  CalendarToday,
  AirlineSeatReclineNormal 
} from '@mui/icons-material';
import axios from 'axios';
import './css/ReservationList.css';

const ReservationList = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user?.role === 'admin' 
        ? 'http://localhost:5000/api/airline/getReservations'
        : 'http://localhost:5000/api/airline/myReservations';
        
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setReservations(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/airline/updateStatus/${id}`, {
        status: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchReservations();
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading reservations...</Typography>
      </Box>
    );
  }

  return (
    <Box className="reservation-container">
      <Typography variant="h4" component="h1" className="page-title">
        <Flight sx={{ mr: 2, verticalAlign: 'middle' }} />
        {user?.role === 'admin' ? 'All Reservations' : 'My Bookings'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        Total Reservations: {reservations.length}
      </Typography>

      <Grid container spacing={3}>
        {reservations.map((reservation) => (
          <Grid item xs={12} md={6} lg={4} key={reservation._id}>
            <Card className="reservation-card">
              <CardContent>
                <Stack spacing={2}>
                  <Box className="card-header">
                    <Typography variant="h6" component="h3">
                      {reservation.bookingReference}
                    </Typography>
                    <Chip
                      label={reservation.status ? 'Confirmed' : 'Pending'}
                      color={reservation.status ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>

                  <Box className="passenger-info">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2">{reservation.passengerName}</Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{reservation.email}</Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{reservation.phone}</Typography>
                    </Stack>
                  </Box>

                  <Box className="flight-info">
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Flight Details
                    </Typography>
                    
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>Flight:</strong> {reservation.flightNumber}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Route:</strong> {reservation.departure} → {reservation.destination}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(reservation.departureDate)}
                        </Typography>
                      </Stack>
                      {reservation.seatNumber && reservation.seatNumber !== 'Not Assigned' && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AirlineSeatReclineNormal fontSize="small" color="action" />
                          <Typography variant="body2">
                            Seat: {reservation.seatNumber}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={2} alignItems="center">
                    {user?.role === 'admin' ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => updateStatus(reservation._id, reservation.status)}
                        color={reservation.status ? 'error' : 'success'}
                      >
                        {reservation.status ? 'Mark as Pending' : 'Confirm Booking'}
                      </Button>
                    ) : (
                      !reservation.status && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => updateStatus(reservation._id, reservation.status)}
                          color="success"
                        >
                          Confirm Booking
                        </Button>
                      )
                    )}
                    
                    {reservation.price && (
                      <Typography variant="h6" color="primary">
                        Total: ${reservation.price}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {reservations.length === 0 && !loading && (
        <Box className="empty-state">
          <Flight sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No reservations found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Start by creating your first flight reservation
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReservationList;