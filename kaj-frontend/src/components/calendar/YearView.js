import React from 'react';
import { format, getMonth, isToday, isWeekend } from 'date-fns';


import './assets/YearView.css';

function YearView({currentYear, handleMonthClick}) {
    const monthsOfYear = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));
  
    const isCurrentMonth = (month) => {
      const currentMonth = new Date().getMonth();
      return month.getMonth() === currentMonth;
    };  

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