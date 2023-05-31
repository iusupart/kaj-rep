import React from 'react';

function TopBar() {
  return (
    <div className="top-section">
      <div className="content">
      <img className="logo" src="./logokaj.png" alt="Logo" />
        <input type="text" placeholder="Search..." className="search-input item" />
        <div className="circle">A</div>
      </div>
    </div>
  );
}

export default TopBar;
