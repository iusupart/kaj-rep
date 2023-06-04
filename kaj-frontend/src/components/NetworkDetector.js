import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './calendar/assets/NetworkDetector.css';

/**
 * NetworkDetector is a React component that detects the user's online/offline status and
 * renders a message when there is no internet connection.
 */
function NetworkDetector() {
  // State to track the online/offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Hook from React Router DOM to navigate between pages
  const navigate = useNavigate();

  /**
   * Updates the online/offline status based on the navigator.onLine property.
   */
  const updateNetwork = () => {
    setIsOnline(navigator.onLine);
  };

  // Register event listeners when the component mounts
  useEffect(() => {
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  }, []);

  /**
   * Handles the button click event and navigates to the Dashboard page.
   */
  const handleButtonClick = () => {
    navigate('/svg');
  };

  // Render the network detector message when offline, otherwise return null
  return !isOnline ? (
    <div className="network-detector">
      <div className="network-detector-inner">
        <h2>No internet connection</h2>
        <p>You can only access the Dashboard page</p>
        <button className="network-detector-button" onClick={handleButtonClick}>
          Go to Dashboard
        </button>
      </div>
    </div>
  ) : null;
}

export default NetworkDetector;
