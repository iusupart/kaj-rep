import React from 'react';
import { format } from 'date-fns';

import './assets/YearView.css';

// Component for the year view calendar
function YearView({ currentYear, handleMonthClick }) {
  const monthsOfYear = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));

  return (
    <div className="months-grid">
      {monthsOfYear.map(month => (
        <div
          key={month.toString()}
          className={`${month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear() ? 'month current' : 'month'}`}
          onClick={() => handleMonthClick(month)}
        >
          <span className="month-name">{format(month, 'MMM')}</span>
        </div>
      ))}
    </div>
  );
}

export default YearView;