// src/components/car/AvailabilityCalendar.jsx
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';

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

export default function AvailabilityCalendar({ availability }) {
  const events = availability.map(period => ({
    title: period.status === 'available' ? 'Available' : 'Booked',
    start: new Date(period.start_date),
    end: new Date(period.end_date),
    allDay: true,
    status: period.status
  }));

  const eventStyleGetter = (event) => {
    const backgroundColor = event.status === 'available' ? '#51cf66' : '#ff6b6b';
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}
