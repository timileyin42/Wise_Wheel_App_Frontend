import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  CircularProgress
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { useQuery } from '@tanstack/react-query';
import { getCarAvailability } from '../../services/car';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventStyleGetter = (event) => ({
  style: {
    backgroundColor: event.status === 'available' ? '#51cf66' : '#ff6b6b',
    borderRadius: '4px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block'
  }
});

export default function CarMap({ latitude, longitude, make, model, carId }) {
  const [activeTab, setActiveTab] = useState(0);
  
  const { data: availability, isLoading } = useQuery({
    queryKey: ['car-availability', carId],
    queryFn: () => getCarAvailability(carId),
    enabled: !!carId
  });

  const position = [latitude, longitude];
  const events = availability?.map(period => ({
    title: period.status === 'available' ? 'Available' : 'Booked',
    start: new Date(period.start_date),
    end: new Date(period.end_date),
    allDay: true,
    status: period.status
  })) || [];

  return (
    <Box sx={{ height: 800, width: '100%', mt: 4, borderRadius: 2, overflow: 'hidden' }}>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Location Map" />
        <Tab label="Availability Calendar" />
      </Tabs>
      
      {activeTab === 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Vehicle Location
          </Typography>
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: '90%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                <Typography variant="subtitle1">
                  {make} {model}
                </Typography>
                <Typography variant="body2">
                  Available for pickup here
                </Typography>
              </Popup>
            </Marker>
          </MapContainer>
        </>
      ) : (
        <Paper sx={{ p: 2, height: '90%' }}>
          <Typography variant="h6" gutterBottom>
            Booking Availability
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              defaultView="month"
              eventPropGetter={eventStyleGetter}
            />
          )}
        </Paper>
      )}
    </Box>
  );
}
