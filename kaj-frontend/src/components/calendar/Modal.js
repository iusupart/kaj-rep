import React, { useState, useEffect } from 'react';
import { format, isBefore, isEqual, parseISO, startOfDay } from 'date-fns';

function Modal({ selectedDate, handleCloseModal, socket }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [endDate, setEndDate] = useState(format(selectedDate, 'yyyy-MM-dd'));
  const [timeTo, setTimeTo] = useState('');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchEventsByDate = (date) => {
    socket.emit("get-events-by-date", { date: format(date, 'yyyy-MM-dd') });
    socket.on("get-events-by-date-response", (response) => {
      if (response.success) {
        console.log(response.events)
        setEvents(response.events);
      } else {
        // Обработка ошибки
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

      }
    })
  })

  function getColorByName(name) {
    const category = categories.find(cat => cat.name === name);
  
    return category ? category.color : undefined;
  }

  const hadleDelete = (e) => {
    e.preventDefault();

    socket.emit("delete-event", {_id: e._id});
    socket.on("delete-event-response", (response) => {
      if (response.success) {
        fetchEventsByDate(selectedDate);
      } else {

      } 
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedDateTime = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${timeFrom}`);
    const endDateTime = parseISO(`${endDate}T${timeTo}`);
    const now = new Date();

    if (isBefore(selectedDateTime, now)) {
      alert('The event cannot start in the past!');
      return;
    }

    if (isBefore(endDateTime, now)) {
      alert('The event cannot end in the past!');
      return;
    }

    const formattedSelectedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const selectedDateParsed = new Date(formattedSelectedDate);
    const end = new Date(endDate);
    const isEqual = selectedDateParsed.getTime() === end.getTime();

    if (isEqual && isBefore(endDateTime, selectedDateTime)) {
      alert('The end time cannot be earlier than the start time on the same day!');
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
      } else {
        alert("Failed")
      }
    })
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleCloseModal}>&times;</span>
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
          <button type="submit">Add Event</button>
        </form>
        <br/>
          </>
        )}
        <div>All events</div>
        <ul>
          {events.map((event, index) => (
            <li key={index} style={
              event.category === 'none' 
              ? {backgroundColor: "gray"} 
              : {backgroundColor: getColorByName(event.category)}
            }>
              {event.title} - {event.category} - {event.timeFrom} to {event.timeTo}
              <button onClick={() => handleDeleteEvent(event)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Modal;

          
