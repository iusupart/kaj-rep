import React, { useState, useEffect } from 'react';
import './assets/WeekView.css';
import moment from 'moment-timezone';
import { isWithinInterval } from 'date-fns';


function WeekView({ currentWeek, firstMonday, currentDate, handleClickDay, socket, fetchEventsByInterval, arrData, convertToDate }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const datesOfdaysOfWeek = firstMonday.toDate();
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  const [categories, setCategories] = useState([]);


  const isCurrentDayInCurrentWeek = isWithinInterval(new Date(), {
    start: currentWeek.start,
    end: currentWeek.end,
  });

  const [date, setDate] = useState(moment().tz("Europe/Prague"));

  
  useEffect(() => {
    fetchEventsByInterval(currentWeek.start.toISOString().split('T')[0], currentWeek.end.toISOString().split('T')[0])
  }, [currentWeek.start, currentWeek.end, socket]);


  function addDaysToDate(datesOfdaysOfWeek, days) {
    var date = new Date(datesOfdaysOfWeek);
    date.setDate(date.getDate() + days);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }


  useEffect(() => {
    socket.emit("get-all-categories");
    socket.on("get-all-categories-response", (response) => {
      if (response.success) {
        setCategories(response.categories)
      } else {
        alert("Error in category getting")
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

  function splitStringByColon(inputString) {
    return inputString.split(":");
  }

  function drawAll() {
    return daysOfWeek.map((day, index) => (
      <div key={day}
       onClick={() => handleClickDay(addDaysToDate(datesOfdaysOfWeek, index))}
       className="day-column">
        <div className="day-header">{day}</div>

        
        
        <div className="day-hours">
          {((((date.day() + 6) % 7) === index) && isCurrentDayInCurrentWeek) && (
            <div 
              className="current-time-indicator" 
              style={{top: `${((date.hours() * 60 + date.minutes()) / (24 * 60)) * 100}%`}}
            />
          )}

          {hoursOfDay.map(hour => (
            <div key={hour} className="hour-cell"></div>
          ))}
            {
              arrData.map((event, eventIndex) => (
                drawEvent(addDaysToDate(datesOfdaysOfWeek, index), event, eventIndex)
              ))
            }
        </div>
      </div>
    )) 
  }


  function drawEvent(columnForDraw, event, eventIndex) {
    const formattedDate = `${columnForDraw.getFullYear()}-${("0" + (columnForDraw.getMonth() + 1)).slice(-2)}-${("0" + columnForDraw.getDate()).slice(-2)}`;

    const eventDateFrom = convertToDate(event.dateFrom);
    const eventDateTo = convertToDate(event.dateTo);

    let startTime;
    let endTime;
  
    if (formattedDate === event.dateFrom && formattedDate === event.dateTo) {
      startTime = event.timeFrom.split(':').map(Number);
      endTime = event.timeTo.split(':').map(Number);
    }
    // Если событие начинается в этот день, но заканчивается позже
    else if (formattedDate === event.dateFrom) {
      startTime = event.timeFrom.split(':').map(Number);
      endTime = [23, 59]; // до конца дня
    }
    // Если событие начиналось раньше, но заканчивается в этот день
    else if (formattedDate === event.dateTo) {
      startTime = [0, 0]; // с начала дня
      endTime = event.timeTo.split(':').map(Number);
    }
    // Если событие начиналось раньше и заканчивается позже
    else if (eventDateFrom < columnForDraw && columnForDraw < eventDateTo) {
      startTime = [0, 0]; // с начала дня
      endTime = [23, 59]; // до конца дня
    }
    else {
      return null; // Если событие не связано с этим днем
    }
  
    const top = ((startTime[0] * 60 + startTime[1]) / (24 * 60)) * 100;
    const height = (((endTime[0] * 60 + endTime[1]) - (startTime[0] * 60 + startTime[1])) / (24 * 60)) * 100;
  
    return (
      <>
        <div
          key={eventIndex}  // использование eventIndex в качестве уникального ключа
          className="event-rect"
          style={{ top: `${top}%`, height: `${height}%` }}
        >
          <div className="event-rect-inside"
          style={{
            backgroundColor:
              event.category === ""
                ? "gray"
                : getColorByName(event.category),
          }}>
          <div className="event-rect-inside-text">
          {event.title}
          </div>
          </div>
        </div>
      </>
    );
  }
  
  

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(moment().tz("Europe/Prague"));
    }, 60000);

    return function cleanup() {
      clearInterval(timer);
    }
  }, []);

  return (
    <div className="calendar">
      <div className="time-column">
        <div className="time-slot"></div> 
        {hoursOfDay.map(hour => (
          <div key={hour} className="time-slot">{hour}:00</div>
        ))}
      </div>
      {
        drawAll()
      }
    </div>
  );
}

export default WeekView; 
