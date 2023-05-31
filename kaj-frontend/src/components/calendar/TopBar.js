import React from 'react';

function TopBar() {
  return (
    <div className="top-section">
      <div className="content">
      <img className="logo" src="./logokaj.png" alt="Logo" />
        <input type="text" placeholder="Поиск..." className="search-input item" />
        {/* <div>HOW TO USE CALENDAR</div> */}
        <div className="circle">A</div>
      </div>
    </div>
  );
}

export default TopBar;
