import React, { useState, useEffect } from 'react';
import './assets/AuthPage.css';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import NetworkDetector from '../components/NetworkDetector';

/**
 * AuthPage is a React component that provides user authentication functionality.
 * Users can sign in or sign up with their email and password.
 */
function AuthPage() {
  // State variables
  const [isSignInActive, setIsSignInActive] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [registerFailed, setRegisterFailed] = useState(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  /**
   * Check if there is a valid token in local storage.
   * If the token is valid and not expired, navigate to the calendar page.
   * Otherwise, remove the token from local storage.
   * Connect to the socket server.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        if (isExpired) {
          alert('TOKEN IS EXPIRED!');
          localStorage.removeItem('token');
        } else {
          navigate('/calendar');
        }
      } catch (err) {
        alert('ERROR DECODING!');
        localStorage.removeItem('token');
      }
    }
    connectToSocket();
  }, [navigate]);

  /**
   * Connect to the socket server.
   * Set the socket object in the state.
   */
  const connectToSocket = () => {
    const newSocket = io('http://localhost:3000/public', { autoConnect: false });
    setSocket(newSocket);
    newSocket.connect();
  };

  /**
   * Validate email format using regular expression.
   * Returns true if the email is valid, false otherwise.
   * @param {string} email - Email address to validate.
   * @returns {boolean} - Indicates if the email is valid.
   */
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Event handler for email input change.
   * Updates the email state and checks for email format errors.
   * @param {object} e - Event object.
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!validateEmail(e.target.value));
  };

  /**
   * Event handler for password input change.
   * Updates the password state and checks for password length errors.
   * @param {object} e - Event object.
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(e.target.value.length < 8);
  };

  /**
   * Event handler for form submission.
   * Validates the form inputs and performs sign in or sign up actions accordingly.
   * @param {object} e - Event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailError || passwordError) {
      alert('There are errors in your form');
    } else {
      const additionalParam = e.nativeEvent.submitter.dataset.additionalParam;
      if (additionalParam === 'signin') {
        socket.emit('login', { email, password });

        socket.on('login-response', (response) => {
          if (response.success) {
            localStorage.setItem('token', response.token);
            navigate('/calendar');
          } else {
            setLoginFailed(true);
            setLoginErrorMsg('Invalid username or password.');
          }
        });
      } else if (additionalParam === 'signup') {
        socket.emit('register', { email, password });

        socket.on('register-response', (response) => {
          if (response.success) {
            setIsSignInActive(true);
          } else {
            setRegisterFailed(true);
            setRegisterErrorMsg('User already created');
          }
        });
      } else {
        alert('SOME ERROR WITH HANDLING PARAM!');
      }
    }
  };

  return (
    <div className="container">
      <NetworkDetector />

      <div className="form-container">
        {isSignInActive ? (
          <>
            <img src="./logo-black.svg" alt="Logo" className="logo" />
            <h1 className="header-text">SIGN IN</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? 'input-error' : ''}
                required
              />
              {emailError && <div className="error-message">Please enter a valid email.</div>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className={passwordError ? 'input-error' : ''}
                required
              />
              {passwordError && (
                <div className="error-message">Password must be at least 8 characters long</div>
              )}
              {loginFailed && <div className="error-message">{loginErrorMsg}</div>}
              <button className="custom-button" type="submit" data-additional-param="signin">
                Sign in
              </button>
            </form>
            <div className="under-text">
              Don't have an account?{' '}
              <a href="#" className="link-text" onClick={() => setIsSignInActive(false)}>
                Sign Up
              </a>
            </div>
          </>
        ) : (
          <>
            <img src="./logo-black.svg" alt="Logo" className="logo" />
            <h1 className="header-text">SIGN UP</h1>
            {registerFailed && <div className="error-message">{registerErrorMsg}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? 'input-error' : ''}
                required
              />
              {emailError && <div className="error-message">Please enter a valid email</div>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className={passwordError ? 'input-error' : ''}
                required
              />
              {passwordError && (
                <div className="error-message">Password must be at least 8 characters long</div>
              )}
              <button className="custom-button" type="submit" data-additional-param="signup">
                Sign up
              </button>
            </form>
            <div className="under-text">
              Already have an account?{' '}
              <a href="#" className="link-text" onClick={() => setIsSignInActive(true)}>
                Sign In
              </a>
            </div>
          </>
        )}
      </div>
      <div className="right-section" />
    </div>
  );
}

export default AuthPage;
