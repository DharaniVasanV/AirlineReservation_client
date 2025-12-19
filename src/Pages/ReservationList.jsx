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
  AirlineSeatReclineNormal,
  Download,
  CreditCard
} from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
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
        ? 'https://airlinereservation-server.onrender.com/api/airline/getReservations'
        : 'https://airlinereservation-server.onrender.com/api/airline/myReservations';
        
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setReservations(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch reservations'+error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://airlinereservation-server.onrender.com/api/airline/updateStatus/${id}`, {
        status: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchReservations();
      }
    } catch (error) {
      setError('Failed to update status'+error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadTicket = (reservation) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(25, 118, 210);
    pdf.text('SkyWings Platform', 20, 30);
    pdf.text('E-Ticket', 20, 45);
    
    // Booking Reference
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Booking Reference: ${reservation.bookingReference}`, 20, 65);
    
    // Passenger Details
    pdf.setFontSize(12);
    pdf.text('Passenger Information:', 20, 85);
    pdf.text(`Name: ${reservation.passengerName}`, 25, 100);
    pdf.text(`Email: ${reservation.email}`, 25, 115);
    pdf.text(`Phone: ${reservation.phone}`, 25, 130);
    if (reservation.passportNumber) {
      pdf.text(`Passport: ${reservation.passportNumber}`, 25, 145);
    }
    
    // Flight Details
    pdf.text('Flight Information:', 20, 165);
    pdf.text(`Flight: ${reservation.flightNumber}`, 25, 180);
    pdf.text(`From: ${reservation.departure}`, 25, 195);
    pdf.text(`To: ${reservation.destination}`, 25, 210);
    pdf.text(`Date: ${formatDate(reservation.departureDate)}`, 25, 225);
    if (reservation.seatNumber && reservation.seatNumber !== 'Not Assigned') {
      pdf.text(`Seat: ${reservation.seatNumber}`, 25, 240);
    }
    pdf.text(`Price: ₹${reservation.price}`, 25, 255);
    
    // Status
    pdf.text(`Status: ${reservation.status ? 'Confirmed' : 'Pending'}`, 20, 275);
    
    // Footer
    pdf.setFontSize(10);
    pdf.text('Thank you for choosing SkyWings Platform!', 20, 290);
    
    pdf.save(`ticket-${reservation.bookingReference}.pdf`);
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
                      {reservation.passportNumber && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CreditCard fontSize="small" color="action" />
                          <Typography variant="body2">
                            Passport: {reservation.passportNumber}
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
                        Total: ₹{reservation.price}
                      </Typography>
                    )}
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => downloadTicket(reservation)}
                      color="primary"
                    >
                      Download Ticket
                    </Button>
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