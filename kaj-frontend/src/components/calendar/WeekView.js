import React, { useState, useEffect } from 'react';
import './WeekView.css';
import moment from 'moment-timezone';


function WeekView() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDate = moment();
  const currentDayOfWeek = currentDate.isoWeekday();

  const daysToSubtract = currentDayOfWeek - 1;

  // Получаем первый понедельник путем вычитания дней
  const firstMonday = currentDate.subtract(daysToSubtract, 'days');

  // Получать с бэка дату первого понедельника
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
    }
  ];
 

  function addDaysToDate(datesOfdaysOfWeek, days) {
    var date = new Date(datesOfdaysOfWeek);
    date.setDate(date.getDate() + days);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return ""+date;
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
    // let promezData = addDaysToDate(datesOfdaysOfWeek, index)
    return daysOfWeek.map((day, index) => (
      <div key={day} className="day-column">
        {/* <div className="day-header-2">{addDaysToDate(datesOfdaysOfWeek, index)}</div> */}
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
    console.log(columnForDraw)

    const start = convertToDate(event.dateFrom);
    const end = convertToDate(event.dateTo);
  
    const isSameDay = start.toDateString() === end.toDateString();
    const isWithinEvent = start <= columnForDraw && columnForDraw <= end;
  
    if (isSameDay) {
      const startTime = splitStringByColon(event.timeFrom);
      const endTime = splitStringByColon(event.timeTo);

      const top = ((parseInt(startTime[0]) * 60 + parseInt(startTime[1])) / (24 * 60)) * 100;
      const height = ((parseInt(endTime[0]) * 60 + parseInt(endTime[1]) - parseInt(startTime[0]) * 60 + parseInt(startTime[1])) / (24 * 60)) * 100;
  
      return (
        <div
          className="event-rect"
          style={{ top: `${top}%`, height: `${height}%` }}
        >
          {event.title}
        </div>
      );
    } else if (isWithinEvent) {
      const startOfDay = convertToDate(columnForDraw);
      const startTime = splitStringByColon(event.timeFrom);
  
      const top = ((parseInt(startTime[0]) * 60 + parseInt(startTime[1])) / (24 * 60)) * 100;
      const height = 100 - top;
  
      return (
        <div
          className="event-rect"
          style={{ top: `${top}%`, height: `${height}%` }}
        >
          {event.title}
        </div>
      );
    } else {
      return null;
    }
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
