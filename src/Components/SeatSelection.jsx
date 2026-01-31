import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  AirlineSeatReclineNormal,
  AirlineSeatReclineExtra,
  Close
} from '@mui/icons-material';
import axios from 'axios';
import './SeatSelection.css';

const SeatSelection = ({ selectedFlight, onSeatSelect, selectedSeat }) => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  
  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      if (selectedFlight?._id) {
        try {
          const response = await axios.get(`https://airlinereservation-server.onrender.com/api/airline/flights/${selectedFlight._id}/occupied-seats`);
          if (response.data.success) {
            setOccupiedSeats(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching occupied seats:', error);
        }
      }
    };
    
    fetchOccupiedSeats();
  }, [selectedFlight]);
  
  // Generate seat layout (6 seats per row, 20 rows)
  const generateSeats = () => {
    const seats = [];
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let row = 1; row <= 20; row++) {
      for (let letter of seatLetters) {
        const seatNumber = `${row}${letter}`;
        seats.push({
          number: seatNumber,
          row: row,
          letter: letter,
          isOccupied: occupiedSeats.includes(seatNumber),
          isSelected: selectedSeat === seatNumber,
          isPremium: row <= 3 // First 3 rows are premium
        });
      }
    }
    return seats;
  };

  const seats = generateSeats();

  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) return;
    
    if (selectedSeat === seatNumber) {
      onSeatSelect(''); // Deselect
    } else {
      onSeatSelect(seatNumber);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.isOccupied) return '#f44336'; // Red for occupied
    if (seat.isSelected) return '#4caf50'; // Green for selected
    if (seat.isPremium) return '#ff9800'; // Orange for premium
    return '#2196f3'; // Blue for available
  };

  const getSeatIcon = (seat) => {
    if (seat.isPremium) {
      return <AirlineSeatReclineExtra />;
    }
    return <AirlineSeatReclineNormal />;
  };

  return (
    <Paper className="seat-selection-container">
      <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
        Select Your Seat
      </Typography>
      
      {/* Legend */}
      <Box className="seat-legend">
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            icon={<AirlineSeatReclineNormal />}
            label="Available"
            sx={{ bgcolor: '#2196f3', color: 'white' }}
          />
          <Chip
            icon={<AirlineSeatReclineExtra />}
            label="Premium"
            sx={{ bgcolor: '#ff9800', color: 'white' }}
          />
          <Chip
            icon={<AirlineSeatReclineNormal />}
            label="Selected"
            sx={{ bgcolor: '#4caf50', color: 'white' }}
          />
          <Chip
            icon={<Close />}
            label="Occupied"
            sx={{ bgcolor: '#f44336', color: 'white' }}
          />
        </Stack>
      </Box>

      {/* Seat Map */}
      <Box className="seat-map">
        <Typography className="aircraft-label">
          Front of Aircraft
        </Typography>
        
        <Grid container spacing={0.5}>
          {Array.from({ length: 20 }, (_, rowIndex) => (
            <Grid item xs={12} key={rowIndex + 1}>
              <Stack direction="row" spacing={0.5} justifyContent="center">
                {/* Left side seats (A, B, C) */}
                {seats
                  .filter(seat => seat.row === rowIndex + 1 && ['A', 'B', 'C'].includes(seat.letter))
                  .map(seat => (
                    <Button
                      key={seat.number}
                      variant="contained"
                      size="small"
                      className="seat-button"
                      onClick={() => handleSeatClick(seat.number)}
                      disabled={seat.isOccupied}
                      sx={{
                        bgcolor: getSeatColor(seat),
                        '&:hover': {
                          bgcolor: seat.isOccupied ? '#f44336' : '#1976d2'
                        }
                      }}
                    >
                      {getSeatIcon(seat)}
                    </Button>
                  ))}
                
                {/* Aisle space */}
                <Box className="aisle-space" />
                
                {/* Right side seats (D, E, F) */}
                {seats
                  .filter(seat => seat.row === rowIndex + 1 && ['D', 'E', 'F'].includes(seat.letter))
                  .map(seat => (
                    <Button
                      key={seat.number}
                      variant="contained"
                      size="small"
                      className="seat-button"
                      onClick={() => handleSeatClick(seat.number)}
                      disabled={seat.isOccupied}
                      sx={{
                        bgcolor: getSeatColor(seat),
                        '&:hover': {
                          bgcolor: seat.isOccupied ? '#f44336' : '#1976d2'
                        }
                      }}
                    >
                      {getSeatIcon(seat)}
                    </Button>
                  ))}
                
                {/* Row number */}
                <Typography className="row-number">
                  {rowIndex + 1}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
        
        <Typography className="aircraft-label">
          Back of Aircraft
        </Typography>
      </Box>

      {selectedSeat && (
        <Box className="selected-seat-info">
          <Typography variant="body1">
            Selected Seat: <strong>{selectedSeat}</strong>
            {seats.find(s => s.number === selectedSeat)?.isPremium && (
              <Chip label="Premium" size="small" sx={{ ml: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
            )}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SeatSelection;