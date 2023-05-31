import React from 'react';
import { format } from 'date-fns';

function CalendarHeader({ currentMonth, handlePrevMonth, handleNextMonth, handleDropdownToggle, dropdownOpen, handleOptionSelect, selectedOption }) {
  return (
    <div className="header">
      <div className="dropdown">
        <button className="button" onClick={handleDropdownToggle}>{selectedOption}</button>
        {dropdownOpen && (
          <ul className="dropdown-menu">
            <li onClick={() => handleOptionSelect('Year')}>Year</li>
            <li onClick={() => handleOptionSelect('Month')}>Month</li>
            <li onClick={() => handleOptionSelect('Week')}>Week</li>
          </ul>
        )}
      </div>
      <button className="button" onClick={handlePrevMonth}>Prev Month</button>
      <h2 className="month-year">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button className="button" onClick={handleNextMonth}>Next Month</button>
    </div>
  );
}

export default CalendarHeader;
