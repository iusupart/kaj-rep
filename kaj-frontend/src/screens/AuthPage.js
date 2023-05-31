import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './AuthPage.css';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
    const [isSignInActive, setIsSignInActive] = useState(true);
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp < Date.now() / 1000;
                if (isExpired) {
                    alert("TOKEN IS EXPIRED!");
                    localStorage.removeItem("token");
                } else {
                    navigate('/calendar');
                }
            } catch (err) {
                alert("ERROR DECODING!")
                localStorage.removeItem("token");
            }
        }
        connectToSocket();
    }, []);

    const connectToSocket = () => {
        const newSocket = io('http://localhost:3000/public', { autoConnect: false });
        setSocket(newSocket);
        newSocket.connect();
    };

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(!validateEmail(e.target.value));
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(e.target.value.length < 8);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (emailError || passwordError) {
            alert("There are errors in your form.");
        } else {
            const additionalParam = e.nativeEvent.submitter.dataset.additionalParam;;
            if (additionalParam === "signin") {
                socket.emit("login", {email, password})

                socket.on("login-response", (response) => {
                  if (response.success) {
                    localStorage.setItem("token", response.token);
                    navigate('/calendar');
                    alert("SUCCESS REDIRECT!");
                  } else {
                    alert("SOME ERROR!");
                  } 
                });
            } else if (additionalParam === "signup") {
                socket.emit("register", {email, password})

                socket.on("register-response", (response) => {
                    if (response.success) {
                        setIsSignInActive(true);
                        alert("SUCCESS REDIRECT!");
                        // displayModal(response.message, "success");
                    } else {
                        alert("SOME ERROR!");
                        // displayModal(response.message, "failed");
                    }
               });
            } else {
                alert("SOME ERROR WITH HANDLING PARAM!");
            }
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                {isSignInActive ? (
                    <>
                        <img src="./logokaj.png" alt="Logo" className="logo" />
                        <h1 className="header-text">SIGN IN</h1>
                        <form onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} className={emailError ? "input-error" : ""} required />
                            {emailError && <div className="error-message">Please enter a valid email.</div>}
                            <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} className={passwordError ? "input-error" : ""} required />
                            {passwordError && <div className="error-message">Password must be at least 8 characters long.</div>}
                            <button className="custom-button" type="submit" data-additional-param="signin">Sign in</button>
                        </form>
                        <div className="under-text">Don't have account? <a href="#" className="link-text" onClick={() => setIsSignInActive(false)}>Sign Up</a></div>
                    </>
                ) : (
                    <>
                        <img src="./logokaj.png" alt="Logo" className="logo" />
                        <h1 className="header-text">SIGN UP</h1>
                        <form onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} className={emailError ? "input-error" : ""} required />
                            {emailError && <div className="error-message">Please enter a valid email.</div>}
                            <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} className={passwordError ? "input-error" : ""} required />
                            {passwordError && <div className="error-message">Password must be at least 8 characters long.</div>}
                            <button className="custom-button" type="submit" data-additional-param="signup">Sign up</button>
                        </form>
                        <div className="under-text">Already have account? <a href="#" className="link-text" onClick={() => setIsSignInActive(true)}>Sign In</a></div>
                    </>
                )}
            </div>
            <div className="right-section" />
        </div>
    );
}

export default AuthPage;
