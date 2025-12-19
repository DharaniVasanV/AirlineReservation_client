import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { FlightTakeoff, Person } from '@mui/icons-material';
import axios from 'axios';
import './css/BookingForm.css';

const BookingForm = ({ user, selectedFlight, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    passengerName: '',
    email: '',
    phone: '',
    seatNumber: '',
    passportNumber: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        passengerName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        seatNumber: '',
        passportNumber: ''
      });
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFlight) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please select a flight first from the search page.'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        ...formData,
        flightId: selectedFlight._id
      };
      
      const response = await axios.post('https://airlinereservation-server.onrender.com/api/airline/addReservation', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAlert({
          show: true,
          type: 'success',
          message: `Booking confirmed! Reference: ${response.data.data.bookingReference}`
        });
        
        // Clear form for next customer
        setFormData({
          passengerName: '',
          email: '',
          phone: '',
          seatNumber: '',
          passportNumber: ''
        });
        
        // Navigate to My Bookings after 2 seconds and clear selected flight
        setTimeout(() => {
          if (onBookingSuccess) {
            onBookingSuccess();
          }
        }, 2000);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Booking failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="booking-container">
      <Box className="booking-form">
        <Typography variant="h4" component="h1" gutterBottom className="form-title">
          <FlightTakeoff sx={{ mr: 2, verticalAlign: 'middle' }} />
          {selectedFlight ? 'Complete Your Booking' : 'Flight Reservation'}
        </Typography>

        {selectedFlight && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
            <Typography variant="h6">{selectedFlight.flightNumber} - {selectedFlight.airline}</Typography>
            <Typography>{selectedFlight.departure} → {selectedFlight.destination}</Typography>
            <Typography>Date: {selectedFlight.flightDate ? new Date(selectedFlight.flightDate).toLocaleDateString('en-IN') : 'N/A'}</Typography>
            <Typography>Departure: {selectedFlight.departureTime} | Arrival: {selectedFlight.arrivalTime}</Typography>
            <Typography variant="h6">Price: ₹{selectedFlight.price}</Typography>
          </Box>
        )}

        {alert.show && (
          <Alert 
            severity={alert.type} 
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              name="passengerName"
              label="Passenger Name"
              value={formData.passengerName}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="seatNumber"
                label="Preferred Seat (Optional)"
                value={formData.seatNumber}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., 12A"
              />
              <TextField
                name="passportNumber"
                label="Passport Number"
                value={formData.passportNumber}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g., A12345678"
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <FlightTakeoff />}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? 'Booking...' : 'Book Flight'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default BookingForm;