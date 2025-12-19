import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Search, 
  Flight, 
  Person, 
  Email, 
  Phone, 
  CalendarToday,
  AirlineSeatReclineNormal 
} from '@mui/icons-material';
import axios from 'axios';
import './css/SearchReservation.css';

const SearchReservation = () => {
  const [searchReference, setSearchReference] = useState('');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchReference.trim()) return;

    setLoading(true);
    setError('');
    setReservation(null);

    try {
      const response = await axios.get(`https://airlinereservation-server.onrender.com/api/airline/reservation/${searchReference}`);
      
      if (response.data.success) {
        setReservation(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Reservation not found. Please check your booking reference.');
      } else {
        setError('Failed to search reservation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box className="search-container">
      <Box className="search-form">
        <Typography variant="h4" component="h1" className="search-title">
          <Search sx={{ mr: 2, verticalAlign: 'middle' }} />
          Find Your Reservation
        </Typography>

        <form onSubmit={handleSearch}>
          <Stack spacing={3}>
            <TextField
              label="Booking Reference"
              value={searchReference}
              onChange={(e) => setSearchReference(e.target.value)}
              placeholder="Enter your booking reference (e.g., SW12345678)"
              required
              fullWidth
              InputProps={{
                startAdornment: <Flight sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Searching...' : 'Search Reservation'}
            </Button>
          </Stack>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {reservation && (
          <Card className="reservation-result" sx={{ mt: 4 }}>
            <CardContent>
              <Stack spacing={3}>
                <Box className="result-header">
                  <Typography variant="h5" component="h2" color="primary">
                    Reservation Found
                  </Typography>
                  <Chip
                    label={reservation.status ? 'Confirmed' : 'Pending'}
                    color={reservation.status ? 'success' : 'warning'}
                  />
                </Box>

                <Box className="booking-reference">
                  <Typography variant="h6" color="text.secondary">
                    Booking Reference: <strong>{reservation.bookingReference}</strong>
                  </Typography>
                </Box>

                <Box className="passenger-details">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Passenger Information
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Person color="action" />
                      <Typography variant="body1">{reservation.passengerName}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Email color="action" />
                      <Typography variant="body1">{reservation.email}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Phone color="action" />
                      <Typography variant="body1">{reservation.phone}</Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Box className="flight-details">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Flight Information
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant="body1">
                      <strong>Flight Number:</strong> {reservation.flightNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Route:</strong> {reservation.departure} → {reservation.destination}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CalendarToday color="action" />
                      <Typography variant="body1">
                        <strong>Flight Date:</strong> {formatDate(reservation.departureDate)}
                      </Typography>
                    </Stack>
                    {reservation.price && (
                      <Typography variant="body1">
                        <strong>Price:</strong> ₹{reservation.price}
                      </Typography>
                    )}
                    {reservation.passportNumber && (
                      <Typography variant="body1">
                        <strong>Passport:</strong> {reservation.passportNumber}
                      </Typography>
                    )}
                    {reservation.seatNumber && reservation.seatNumber !== 'Not Assigned' && (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <AirlineSeatReclineNormal color="action" />
                        <Typography variant="body1">
                          <strong>Seat:</strong> {reservation.seatNumber}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Box className="booking-date">
                  <Typography variant="body2" color="text.secondary">
                    Booked on: {formatDate(reservation.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default SearchReservation;