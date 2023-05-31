import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import Sidebar from '../components/calendar/Sidebar';
import TopBar from '../components/calendar/TopBar';
import CalendarHeader from '../components/calendar/CalendarHeader';
import GridDays from '../components/calendar/GridDays';
import Modal from '../components/calendar/Modal';
import WeekView from '../components/calendar/WeekView';
import './CalendarPage.css';

import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Month");

  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const connectToSocket = () => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:3000/private', {query: {token}}, { autoConnect: false });
    setSocket(newSocket);
    newSocket.connect();
  };

  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const isExpired = decoded.exp < Date.now() / 1000;
            if (isExpired) {
                alert("TOKEN IS EXPIRED!");
                localStorage.removeItem("token");
                navigate('/');
            } else {
                connectToSocket();
            }
        } catch (err) {
            alert("ERROR DECODING!")
            localStorage.removeItem("token");
            navigate('/');
        }
    } else {
        navigate('/');
    }
  }, []); 

  const startDay = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const endDay = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  const daysOfMonth = eachDayOfInterval({ start: startDay, end: endDay });

  const daysOfWeek = eachDayOfInterval({ start: startOfWeek(currentMonth), end: endOfWeek(currentMonth) });

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleClickDay = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  return (
    <div className="calendar-container">
      <Sidebar
        socket={socket}
      />
      <TopBar />
      <div className="main-section">
        <CalendarHeader
          currentMonth={currentMonth}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          handleDropdownToggle={handleDropdownToggle}
          dropdownOpen={dropdownOpen}
          handleOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
        />
        {selectedOption === 'Month' ? (
          <GridDays 
            daysOfMonth={daysOfMonth}
            currentMonth={currentMonth}
            handleClickDay={handleClickDay}
          />
        ) : selectedOption === 'Week' ? (
          <WeekView 
            // daysOfWeek={daysOfWeek}
            // handleClickDay={handleClickDay}
          />
        ) : null}
        {isModalOpen && (
          <Modal
            selectedDate={selectedDate}
            handleCloseModal={handleCloseModal}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;
