import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * The TopBar component represents the top section of the calendar page,
 * including the logo, search bar, and user dropdown menu.
 * @param {object} socket - The socket object for communication with the server.
 * @param {function} handleClickDay - The event handler for clicking on a day in the calendar grid.
 * @param {function} convertToDate - The function to convert a date string to a Date object.
 * @param {boolean} userDropdownOpen - The flag indicating whether the user dropdown menu is open.
 * @param {function} setUserDropdownOpen - The function to toggle the user dropdown menu.
 * @returns {JSX.Element} TopBar component.
 */
function TopBar({ socket, handleClickDay, convertToDate, userDropdownOpen, setUserDropdownOpen }) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  /**
   * Event handler for changes in the search input.
   * @param {object} event - The event object.
   */
  function handleSearchTextChange(event) {
    const searchTextNow = event.target.value;
    setSearchText(searchTextNow);
    search(searchTextNow);
  }

  /**
   * Perform a search request to the server.
   * @param {string} text - The search text.
   */
  function search(text) {
    socket.emit('search', { text: text });

    socket.on('search-response', (results) => {
      setSearchResults(results.result);
    });
  }

  /**
   * Event handler for quitting the application.
   */
  function handleQuit() {
    localStorage.removeItem('token');
    navigate('/');
  }

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  /**
   * Event handler for input blur.
   * Clears the search results.
   */
  function handleInputBlur() {
    setSearchResults([]);
  }

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
            onBlur={handleInputBlur}
          />

          {searchResults.length > 0 && (
            <ul className="dropdown-menu-searchbar">
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  onClick={() => handleClickDay(convertToDate(result.dateFrom))}
                >
                  {result.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="circle-container">
          <div
            className="circle"
            onClick={() => {
              console.log('Div clicked');
              setUserDropdownOpen(!userDropdownOpen);
            }}
          >
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
