import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Chip,
  Collapse
} from '@mui/material';
import { Add, Edit, Delete, Flight, People, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [flights, setFlights] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [passengers, setPassengers] = useState({});
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: 'SkyWings Airlines',
    departure: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
    availableSeats: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const loadFlights = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/airline/admin/flights', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFlights(response.data.data);
    } catch (error) {
      setError('Error loading flights');
    }
  };

  const loadPassengers = async (flightId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/airline/admin/flights/${flightId}/passengers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassengers(prev => ({ ...prev, [flightId]: response.data.data }));
    } catch (error) {
      setError('Error loading passengers');
    }
  };

  const handleExpandFlight = (flightId) => {
    if (expandedFlight === flightId) {
      setExpandedFlight(null);
    } else {
      setExpandedFlight(flightId);
      if (!passengers[flightId]) {
        loadPassengers(flightId);
      }
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.availableSeats)
      };

      if (editingFlight) {
        await axios.put(`http://localhost:5000/api/airline/flights/${editingFlight._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Flight updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/airline/flights', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Flight added successfully');
      }
      
      setOpen(false);
      setEditingFlight(null);
      resetForm();
      loadFlights();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving flight');
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      departure: flight.departure,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price.toString(),
      totalSeats: flight.totalSeats.toString(),
      availableSeats: flight.availableSeats.toString()
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await axios.delete(`http://localhost:5000/api/airline/flights/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Flight deleted successfully');
        loadFlights();
      } catch (error) {
        setError('Error deleting flight');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      airline: 'SkyWings Airlines',
      departure: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      totalSeats: '',
      availableSeats: ''
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFlight(null);
    resetForm();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Flight Management" />
        <Tab label="Booking Overview" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {tabValue === 0 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Flight Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
            >
              Add Flight
            </Button>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Flight Number</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight._id}>
                    <TableCell>{flight.flightNumber}</TableCell>
                    <TableCell>{flight.departure} → {flight.destination}</TableCell>
                    <TableCell>{flight.departureTime} - {flight.arrivalTime}</TableCell>
                    <TableCell>${flight.price}</TableCell>
                    <TableCell>{flight.availableSeats}/{flight.totalSeats}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(flight)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(flight._id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Flight Bookings Overview</Typography>
          <Grid container spacing={3}>
            {flights.map((flight) => (
              <Grid item xs={12} key={flight._id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6">{flight.flightNumber} - {flight.airline}</Typography>
                        <Typography color="text.secondary">
                          {flight.departure} → {flight.destination}
                        </Typography>
                        <Typography variant="body2">
                          {flight.departureTime} - {flight.arrivalTime}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip 
                          label={`${flight.bookedSeats || 0} Booked`} 
                          color="primary" 
                        />
                        <Chip 
                          label={`${flight.availableSeats} Available`} 
                          color="success" 
                        />
                        <Button
                          onClick={() => handleExpandFlight(flight._id)}
                          endIcon={expandedFlight === flight._id ? <ExpandLess /> : <ExpandMore />}
                        >
                          {expandedFlight === flight._id ? 'Hide' : 'Show'} Passengers
                        </Button>
                      </Stack>
                    </Stack>
                    
                    <Collapse in={expandedFlight === flight._id}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Passenger Details ({flight.bookedSeats || 0} passengers)
                        </Typography>
                        {passengers[flight._id] && passengers[flight._id].length > 0 ? (
                          <TableContainer component={Paper} sx={{ mt: 1 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Passenger Name</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Phone</TableCell>
                                  <TableCell>Seat</TableCell>
                                  <TableCell>Booking Ref</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {passengers[flight._id].map((passenger) => (
                                  <TableRow key={passenger._id}>
                                    <TableCell>{passenger.passengerName}</TableCell>
                                    <TableCell>{passenger.email}</TableCell>
                                    <TableCell>{passenger.phone}</TableCell>
                                    <TableCell>{passenger.seatNumber || 'Not Assigned'}</TableCell>
                                    <TableCell>{passenger.bookingReference}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={passenger.status ? 'Confirmed' : 'Pending'}
                                        color={passenger.status ? 'success' : 'warning'}
                                        size="small"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography color="text.secondary">No passengers booked yet</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFlight ? 'Edit Flight' : 'Add New Flight'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Flight Number"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Airline"
                value={formData.airline}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departure City"
                value={formData.departure}
                onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Destination City"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departure Time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                placeholder="e.g., 10:30 AM"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Arrival Time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                placeholder="e.g., 2:45 PM"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price ($)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Seats"
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Available Seats"
                type="number"
                value={formData.availableSeats}
                onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFlight ? 'Update' : 'Add'} Flight
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;