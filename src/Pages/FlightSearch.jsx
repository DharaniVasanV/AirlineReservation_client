import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert
} from '@mui/material';
import { Search, FlightTakeoff, FlightLand, Schedule, AttachMoney } from '@mui/icons-material';
import axios from 'axios';

const FlightSearch = ({ onFlightSelect }) => {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: ''
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/airline/flights/search', {
        params: searchParams
      });
      setFlights(response.data.data);
    } catch (error) {
      setError('Error searching flights'+error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/airline/flights');
      setFlights(response.data.data);
    } catch (error) {
      setError('Error loading flights'+error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllFlights();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Search Flights
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="From"
                value={searchParams.departure}
                onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
                InputProps={{
                  startAdornment: <FlightTakeoff sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="To"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                InputProps={{
                  startAdornment: <FlightLand sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Departure Date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  disabled={loading}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={loadAllFlights}
                  disabled={loading}
                >
                  Show All
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {flights.map((flight) => (
          <Grid item xs={12} key={flight._id}>
            <Card className="flight-card">
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6" color="primary">
                      {flight.flightNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.airline}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        {flight.flightDate ? new Date(flight.flightDate).toLocaleDateString('en-IN') : 'Date N/A'}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box textAlign="center">
                          <Typography variant="h6">{flight.departureTime}</Typography>
                          <Typography variant="body2">{flight.departure}</Typography>
                        </Box>
                        <FlightTakeoff color="primary" />
                        <Box textAlign="center">
                          <Typography variant="h6">{flight.arrivalTime}</Typography>
                          <Typography variant="body2">{flight.destination}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main">
                        ₹{flight.price}
                      </Typography>
                      <Chip 
                        label={`${flight.availableSeats} seats`}
                        color={flight.availableSeats > 10 ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => onFlightSelect(flight)}
                      disabled={flight.availableSeats === 0}
                    >
                      {flight.availableSeats === 0 ? 'Sold Out' : 'Select Flight'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {flights.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No flights found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FlightSearch;