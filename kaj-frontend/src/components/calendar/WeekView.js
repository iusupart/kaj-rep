import React, { useState, useEffect } from 'react';
import './WeekView.css';
import moment from 'moment-timezone';


function WeekView() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDate = moment();
  const currentDayOfWeek = currentDate.isoWeekday();

  const daysToSubtract = currentDayOfWeek - 1;

  const firstMonday = currentDate.subtract(daysToSubtract, 'days');

  const datesOfdaysOfWeek = firstMonday.toDate();
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);



  const [date, setDate] = useState(moment().tz("Europe/Prague"));

  const arrData = [
    {
      title:"Hello",
      selectedDate:"2023-05-19T22:00:00.000Z",
      text:"Its me",
      category:"",
      dateFrom:"2023-05-31",
      timeFrom:"21:20",
      dateTo:"2023-05-31",
      timeTo:"23:20",
      email:"yusupowartour@gmail.com"
    },
    {
      title:"Hello1",
      selectedDate:"2023-05-19T22:00:00.000Z",
      text:"Its me",
      category:"",
      dateFrom:"2023-06-01",
      timeFrom:"12:20",
      dateTo:"2023-06-03",
      timeTo:"20:20",
      email:"yusupowartour@gmail.com"
    }
  ];
 

  function addDaysToDate(datesOfdaysOfWeek, days) {
    var date = new Date(datesOfdaysOfWeek);
    date.setDate(date.getDate() + days);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
  

  // covert String "YYYY-MM-DD" To Date
  function convertToDate(dateString) {
    const parts = dateString.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Месяцы в объекте Date нумеруются с 0 до 11
    const day = parseInt(parts[2]);

    const date = new Date(year, month, day);
    return date;
  }


  function splitStringByColon(inputString) {
    return inputString.split(":");
  }

  function drawAll() {
    return daysOfWeek.map((day, index) => (
      <div key={day} className="day-column">
        {/* <div className="day-header-2">{""+addDaysToDate(datesOfdaysOfWeek, index)}</div> */}
        <div className="day-header">{day}</div>

        
        
        <div className="day-hours">
          {((date.day() + 6) % 7) === index && (
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
                drawPlease(addDaysToDate(datesOfdaysOfWeek, index), event)
              ))
            }
        </div>
      </div>
    )) 
  }


  function drawPlease(columnForDraw, event) {
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
        key={event.title}
        className="event-rect"
        style={{ top: `${top}%`, height: `${height}%` }}
      >
        <div className="event-rect-inside">
        {event.title}
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
