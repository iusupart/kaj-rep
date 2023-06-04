import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


function TopBar({ socket, handleClickDay, convertToDate, userDropdownOpen, setUserDropdownOpen }) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();


  function handleSearchTextChange(event) {
    const searchTextNow = event.target.value;
    setSearchText(searchTextNow);
    search(searchTextNow)
  }

  function search(text) {
    socket.emit('search', {text: text});

    socket.on('search-response', (results) => {
      setSearchResults(results.result);
    });
  }

  function handleQuit() {
    localStorage.removeItem('token');
    navigate('/');
  }

  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  return (
    <div className="top-section">
      <div className="content">
        <img className="logo" src="./logo-black.svg" alt="Logo" />
        <div className="search-container item">
        <input
          type="text"
          placeholder="Search..."
          className="search-input item"
          value={searchText}
          onChange={handleSearchTextChange}
        />
       
        {searchResults.length > 0 && (
          <ul className="dropdown-menu-searchbar">
            {searchResults.map((result) => (
              <li key={result.id} onClick={() => handleClickDay(convertToDate(result.dateFrom))}>
                {result.title}
              </li>
            ))}
          </ul>
        )}
        </div>
        <div className="circle-container">
        <div className="circle" onClick={() => {
          console.log('Div clicked')
          setUserDropdownOpen(!userDropdownOpen)
          }}>
          <FaUserCircle />
        </div>
        {userDropdownOpen && (
          <ul className="dropdown-menu-circle">
            <li onClick={() => handleQuit()}>Quit</li>
          </ul>
        )}
        </div>
        </div>
    </div>
  );
}

export default TopBar;
