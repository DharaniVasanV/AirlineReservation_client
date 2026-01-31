import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Flight, 
  Person, 
  Email, 
  Phone, 
  CalendarToday,
  AirlineSeatReclineNormal,
  Download,
  CreditCard,
  Cancel
} from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
import './css/ReservationList.css';

const ReservationList = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, reservation: null });

  const fetchReservations = useCallback(async () => {
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
  }, [user?.role]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

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

  const cancelReservation = async (reservation) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://airlinereservation-server.onrender.com/api/airline/cancelReservation/${reservation._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchReservations();
        setCancelDialog({ open: false, reservation: null });
      }
    } catch (error) {
      setError('Failed to cancel reservation: ' + error.response?.data?.message || error.message);
    }
  };

  const handleCancelClick = (reservation) => {
    setCancelDialog({ open: true, reservation });
  };

  const handleCancelConfirm = () => {
    if (cancelDialog.reservation) {
      cancelReservation(cancelDialog.reservation);
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
    pdf.text('AirNexus Platform', 20, 30);
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
    pdf.text('Thank you for choosing AirNexus Platform!', 20, 290);
    
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

      <Typography variant="h6" sx={{ mb: 3, color: '#ffffff', fontWeight: 600, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        Total Reservations: {reservations.length}
      </Typography>

      <Grid container spacing={3}>
        {reservations.map((reservation) => (
          <Grid item xs={12} md={6} lg={4} key={reservation._id}>
            <Card className="reservation-card">
              <CardContent>
                <Stack spacing={2}>
                  <Box className="card-header">
                    <Typography variant="h6" component="h3" sx={{ color: '#0a2463', fontWeight: 700 }}>
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
                      <Typography variant="body2" sx={{ color: '#0a2463', fontWeight: 500 }}>{reservation.passengerName}</Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ color: '#0a2463', fontWeight: 500 }}>{reservation.email}</Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ color: '#0a2463', fontWeight: 500 }}>{reservation.phone}</Typography>
                    </Stack>
                  </Box>

                  <Box className="flight-info">
                    <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                      Flight Details
                    </Typography>
                    
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                        <strong>Flight:</strong> {reservation.flightNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                        <strong>Route:</strong> {reservation.departure} → {reservation.destination}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                          {formatDate(reservation.departureDate)}
                        </Typography>
                      </Stack>
                      {reservation.seatNumber && reservation.seatNumber !== 'Not Assigned' && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AirlineSeatReclineNormal fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                            Seat: {reservation.seatNumber}
                          </Typography>
                        </Stack>
                      )}
                      {reservation.passportNumber && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CreditCard fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                            Passport: {reservation.passportNumber}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
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
                      <>
                        {!reservation.status && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => updateStatus(reservation._id, reservation.status)}
                            color="success"
                          >
                            Confirm Booking
                          </Button>
                        )}
                        {!reservation.status && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => handleCancelClick(reservation)}
                            color="error"
                          >
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={() => downloadTicket(reservation)}
                    >
                      Download
                    </Button>
                  </Stack>

                  {reservation.price && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700 }}>
                        ₹{reservation.price}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {reservations.length === 0 && (
        <Box className="empty-state">
          <Flight sx={{ fontSize: 80, color: '#1e90ff', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#0a2463', fontWeight: 600, mb: 1 }}>
            No Reservations Found
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
            {user?.role === 'admin' 
              ? 'No bookings have been made yet.' 
              : 'You haven\'t made any bookings yet. Start exploring flights!'}
          </Typography>
        </Box>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, reservation: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this reservation?
          </Typography>
          {cancelDialog.reservation && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Booking Reference:</strong> {cancelDialog.reservation.bookingReference}
              </Typography>
              <Typography variant="body2">
                <strong>Flight:</strong> {cancelDialog.reservation.flightNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Route:</strong> {cancelDialog.reservation.departure} → {cancelDialog.reservation.destination}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Note: This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, reservation: null })}>
            Keep Reservation
          </Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            Cancel Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationList;