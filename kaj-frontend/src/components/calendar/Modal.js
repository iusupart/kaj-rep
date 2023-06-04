import React, { useState, useEffect } from 'react';
import { format, isBefore, isEqual, parseISO, startOfDay } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

/**
 * Modal component to display and add events.
 *
 * @param {Date} selectedDate - The currently selected date.
 * @param {Function} handleCloseModal - Function to handle closing the modal.
 * @param {Object} socket - Socket instance for server communication.
 * @param {string} selectedOption - The selected option.
 * @param {Function} fetchEventsByInterval - Function to fetch events by interval.
 * @param {Object} currentWeek - Object representing the current week.
 * @returns {JSX.Element} Modal component.
 */
function Modal({ selectedDate, handleCloseModal, socket, selectedOption, fetchEventsByInterval, currentWeek }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [endDate, setEndDate] = useState(format(selectedDate, 'yyyy-MM-dd'));
  const [timeTo, setTimeTo] = useState('');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Fetches events for the given date.
   *
   * @param {Date} date - The date to fetch events for.
   */
  const fetchEventsByDate = (date) => {
    socket.emit("get-events-by-date", { date: format(date, 'yyyy-MM-dd') });
    socket.on("get-events-by-date-response", (response) => {
      if (response.success) {
        setEvents(response.events);
      } else {
        setErrorMessage("Something went wrong")
      }
    });
  };
  
  useEffect(() => {
    fetchEventsByDate(selectedDate);
  }, [selectedDate, socket]);

  useEffect(() => {
    socket.emit("get-all-categories");
    socket.on("get-all-categories-response", (response) => {
      if (response.success) {
        setCategories(response.categories)
      } else {
        setErrorMessage("Error in category getting")
      }
    })
  });

  /**
   * Retrieves the color for a given category name.
   *
   * @param {string} name - The name of the category.
   * @returns {string|undefined} The color of the category, or undefined if not found.
   */
  function getColorByName(name) {
    const category = categories.find(cat => cat.name === name);
    return category ? category.color : undefined;
  }

  /**
   * Deletes an event.
   *
   * @param {Object} e - The event object to delete.
   */
  const handleDelete = (e) => {
    socket.emit("delete-event", { _id: e._id });
    socket.on("delete-event-response", (response) => {
    if (response.success) {
      fetchEventsByDate(selectedDate);
      fetchEventsByInterval(currentWeek.start.toISOString().split('T')[0], currentWeek.end.toISOString().split('T')[0])
      setErrorMessage(null); // Clear any previous error messages
    } else {
      setErrorMessage(response.message);
    }
    });
  }

  /**
   * Handles the form submission to add a new event.
   *
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const selectedDateTime = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${timeFrom}`);
    const endDateTime = parseISO(`${endDate}T${timeTo}`);
    const now = new Date();

    if (isBefore(selectedDateTime, now)) {
      setErrorMessage('The event cannot start in the past!');
      return;
    }

    if (isBefore(endDateTime, now)) {
      setErrorMessage('The event cannot end in the past!');
      return;
    }

    const formattedSelectedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const selectedDateParsed = new Date(formattedSelectedDate);
    const end = new Date(endDate);
    const isEqual = selectedDateParsed.getTime() === end.getTime();

    if (isEqual && isBefore(endDateTime, selectedDateTime)) {
      setErrorMessage('The end time cannot be earlier than the start time on the same day!');
      return;
    }

    const event = {
      title,
      selectedDate,
      text,
      category,
      dateFrom: formattedSelectedDate,
      timeFrom: timeFrom,
      dateTo: endDate,
      timeTo: timeTo,
    };

    socket.emit("add-new-event", event);

    socket.on("add-new-event-response", (response) => {
      if (response.success) {
        fetchEventsByDate(selectedDate);
        fetchEventsByInterval(currentWeek.start.toISOString().split('T')[0], currentWeek.end.toISOString().split('T')[0])
        setErrorMessage(null); // Clear any previous error messages
      } else {
        setErrorMessage(response.message);
      }
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleCloseModal}><FaTimes /></span>
        <p>{format(selectedDate, 'd MMMM yyyy')}</p>

        {isBefore(selectedDate, startOfDay(new Date())) ? null : (
          <>
            <form onSubmit={handleFormSubmit}>
              <div>Title</div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required/>
              <div>Description</div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" style={{resize: "none"}}/>
              <div>Category</div>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="none">Don't have category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div>From</div>
              <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} required/>
              <div>To</div>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required/>
              <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} required/>
              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
              <button type="submit">Add Event</button>
            </form>
            <br/>
          </>
        )}
        
        {events.length === 0 ? (
          <div>No events</div>
        ) : (
          <div>All events</div>
        )}

        <ul>
          {events.map((event, index) => (
            <li key={index} className="element-event">
              <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div
                  className="event-category"
                  style={{
                    color: event.category === "none" ? "gray" : getColorByName(event.category),
                  }}
                >
                  {event.category}
                </div>
                <div className="event-description">{event.description}</div>
                <div className="event-time">
                  from {event.timeFrom} to {event.timeTo}
                </div>
              </div>
              <div className="event-delete">
                <FaTimes onClick={() => handleDelete(event)} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Modal;
