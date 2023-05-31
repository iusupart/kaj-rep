import React from 'react';
import { format, getMonth, isToday, isWeekend } from 'date-fns';

function GridDays({ daysOfMonth, currentMonth, handleClickDay }) {
  return (
    <div className="days-grid">
      {daysOfMonth.map(day => (
        <div 
          key={day.toString()} 
          className={`${getMonth(day) === getMonth(currentMonth) ? 'day' : 'other-month-day'} ${isToday(day) ? 'today' : ''}`} 
          onClick={() => handleClickDay(day)}
        >
          <span className="date">{format(day, 'd')}</span>
          <span className={`weekday ${isWeekend(day) ? 'weekend' : ''}`}>{format(day, 'eee')}</span>
        </div>
      ))}
    </div>
  );
}

export default GridDays;
