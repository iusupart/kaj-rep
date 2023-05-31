import React from 'react';
import { format } from 'date-fns';

function CalendarHeader({ currentMonth, handlePrevMonth, handleNextMonth, handleDropdownToggle, dropdownOpen, handleOptionSelect, selectedOption, currentYear, handleNextYear, handlePrevYear }) {
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
      {(selectedOption === 'Month') && (
      <>
        <button className="button" onClick={handlePrevMonth}>Prev Month</button>
        <h2 className="month-year">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button className="button" onClick={handleNextMonth}>Next Month</button>   
      </>   
      )} 
      {(selectedOption === 'Year') && (
      <>
        <button className="button" onClick={handlePrevYear}>Prev Year</button>
        <h2 className="month-year">{currentYear}</h2>
        <button className="button" onClick={handleNextYear}>Next Year</button>   
      </>   
      )} 
    </div>
  );
}

export default CalendarHeader;
