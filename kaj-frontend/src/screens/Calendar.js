import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays } from 'date-fns';
import moment from 'moment-timezone';
import Sidebar from '../components/calendar/Sidebar';
import TopBar from '../components/calendar/TopBar';
import CalendarHeader from '../components/calendar/CalendarHeader';
import GridDays from '../components/calendar/GridDays';
import Modal from '../components/calendar/Modal';
import WeekView from '../components/calendar/WeekView';
import YearView from '../components/calendar/YearView';
import MusicPlayer from '../components/calendar/MusicPlayer';
import NetworkDetector from '../components/NetworkDetector';
import './assets/CalendarPage.css';

import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

/**
 * The Calendar component represents the main calendar page.
 * It handles the rendering of the calendar grid, navigation, and interactions with the server.
 * @returns {JSX.Element} Calendar component.
 */
function Calendar() {
  // State variables
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  const currentDate = moment();
  const currentDayOfWeek = currentDate.isoWeekday();
  const daysToSubtract = currentDayOfWeek - 1;
  const [firstMonday, setFirstMonday] = useState(currentDate.subtract(daysToSubtract, 'days'));
  const [arrData, setArrData] = useState([]);
  const [isMusicPlayerOpened, setIsMusicPlayerOpened] = useState(false);
  const [tracks] = useState([
    { title: 'Chill', src: '/music/3495.mp3', duration: '06:01' },
    { title: 'Hard', src: '/music/175567.mp3', duration: '01:53' },
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Month");
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  // Connect to the socket server
  const connectToSocket = () => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:3000/private', { query: { token } }, { autoConnect: false });
    setSocket(newSocket);
    newSocket.connect();
  };

  // Check for a valid token and connect to the socket on component mount
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
  }, [navigate]); 

  // Calculate the start and end dates of the current month
  const startDay = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const endDay = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
  const daysOfMonth = eachDayOfInterval({ start: startDay, end: endDay });

  // Fetch events for a given interval from the server
  const fetchEventsByInterval = (from, to) => {
    socket.emit("get-events-by-interval", { data: { from: from, to: to } });
    socket.on("get-events-by-interval-response", (response) => {
      if (response.success) {
        setArrData(response.events);
      } else {
        alert("Some error with connecting!")
      }
    });
  };

  // Event handlers for navigating to the next or previous month/year/week
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek({
      start: addDays(currentWeek.start, 7),
      end: addDays(currentWeek.end, 7),
    });
    setFirstMonday(firstMonday.add(7, 'days'));
  };

  const handlePrevWeek = () => {
    setCurrentWeek({
      start: addDays(currentWeek.start, -7),
      end: addDays(currentWeek.end, -7),
    });
    setFirstMonday(firstMonday.subtract(7, 'days'));
  };

  // Event handler for clicking on a day in the calendar grid
  const handleClickDay = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Event handler for closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Event handler for toggling the dropdown
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Event handler for selecting an option from the dropdown
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  // Event handler for clicking on a month in the year view
  const handleMonthClick = (month) => {
    setCurrentMonth(month);
    setSelectedOption("Month")
  };

  /**
   * Convert a date string to a Date object.
   * @param {string} dateString - The date string in the format 'YYYY-MM-DD'.
   * @returns {Date} Converted Date object.
   */
  function convertToDate(dateString) {
    const parts = dateString.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months in the Date object are zero-indexed
    const day = parseInt(parts[2]);

    const date = new Date(year, month, day);
    return date;
  }

  return (
    <div className="calendar-container">
      <NetworkDetector />
      <Sidebar
        socket={socket}
        setIsMusicPlayerOpened={setIsMusicPlayerOpened}
      />
      <TopBar
        socket={socket}
        handleClickDay={handleClickDay}
        convertToDate={convertToDate}
        userDropdownOpen={userDropdownOpen}
        setUserDropdownOpen={setUserDropdownOpen}
      />
      <div className="main-section">
        <MusicPlayer tracks={tracks} isMusicPlayerOpened={isMusicPlayerOpened} />
        {isMusicPlayerOpened ? (
          null
        ) : (
          <>
            <CalendarHeader
              currentMonth={currentMonth}
              handlePrevMonth={handlePrevMonth}
              handleNextMonth={handleNextMonth}
              handleDropdownToggle={handleDropdownToggle}
              dropdownOpen={dropdownOpen}
              handleOptionSelect={handleOptionSelect}
              selectedOption={selectedOption}
              currentYear={currentYear}
              handleNextYear={handleNextYear}
              handlePrevYear={handlePrevYear}
              currentWeek={currentWeek}
              handlePrevWeek={handlePrevWeek}
              handleNextWeek={handleNextWeek}
            />
            {selectedOption === 'Month' ? (
              <GridDays 
                daysOfMonth={daysOfMonth}
                currentMonth={currentMonth}
                handleClickDay={handleClickDay}
              />
            ) : selectedOption === 'Week' ? (
              <WeekView 
                currentWeek={currentWeek}
                firstMonday={firstMonday}
                currentDate={currentDate}
                handleClickDay={handleClickDay}
                socket={socket}
                fetchEventsByInterval={fetchEventsByInterval}
                arrData={arrData}
                convertToDate={convertToDate}
              />
            ) : selectedOption === 'Year' ? (
              <YearView
                handleMonthClick={handleMonthClick}
                currentYear={currentYear}
              />
            ) : null}
            {isModalOpen && (
              <Modal
                selectedDate={selectedDate}
                handleCloseModal={handleCloseModal}
                socket={socket}
                selectedOption={selectedOption}
                fetchEventsByInterval={fetchEventsByInterval}
                currentWeek={currentWeek}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Calendar;
