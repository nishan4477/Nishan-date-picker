import React, { useEffect, useState } from "react";
import "./NepDatePicker.css";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

const NepDatePicker = ({domain="https://kavre.nivid.app",onDateSelect}) => {
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState(null);
  const [activeDayId, setActiveDayId] = useState(null);
  const [apiYear,setApiYear]= useState(null)
  const [apiMonth,setApiMonth] = useState(null)
  const[InputDateDisplay,setInputDateDisplay] = useState(null)
  const weekDay = ["Sun", "mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  function handlePrevBtn(year, prevMonth) {
    if(year && prevMonth){
      setApiYear(year)
      setApiMonth(prevMonth)
    }

  }

  function handleNextBtn(year, nextMonth) {
    if(year && nextMonth){
      setApiYear(year)
      setApiMonth(nextMonth)
    }
  }

  function displayDate(year,month,day){
    const fullDate = `${year}-${month}-${day}`
    setInputDateDisplay(fullDate)
  }

  const dateConfig = {
    1: "बैशाख",
    2: "जेठ",
    3: "असार",
    4: "साउन",
    5: "भदौ",
    6: "असोज",
    7: "कार्तिक",
    8: "मंसिर",
    9: "पुष",
    10: "माघ",
    11: "फागुन",
    12: "चैत",
  };
  useEffect(() => {
    const fetchDate = async (year, month) => {
      try {
        const response = await fetch(
          `${domain}/dashboard/getMonthCalendarApi${
            apiYear && apiMonth ? `?year=${apiYear}&month=${apiMonth}` : ""
          } `
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (e) {
        console.log("cannot fetch", e);
      }
    };

    fetchDate();
  }, [apiYear,apiMonth]);

  return (
    <div className="nepali-calendar">
      <input
        className="calendar-nepali"
        onClick={() => setIsActive(!isActive)}
        value={InputDateDisplay}
      />
      {data && isActive && (
        <div className="calendar">
          <div className="calendar-header">
            <div
              onClick={() => handlePrevBtn(data.prevYear, data.prevMonth)}
              className="action-button"
            >
              <GrFormPrevious />
            </div>
            <div className="date-tittle">{`${data.curYear} ${
              dateConfig[data.curMonth]
            }`}</div>
            <div
              onClick={() => handleNextBtn(data.nextYear, data.nextMonth)}
              className="action-button"
            >
              <GrFormNext />
            </div>
          </div>
          <div className="calendar-day">
            {weekDay.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          <div className="calendar-container">
            <div className="calendar-body">
              {data.monthdata.map((date, index) => {
                const isActive = date.dayid === activeDayId;
                return (
                  <div
                    style={{ color: date.eventColour }}
                    onClick={() =>{ 
                      setActiveDayId(date.dayid)
                      displayDate(date.year,date.nepaliMonth,date.gate)
                      onDateSelect && onDateSelect(date.dayid)
                      setIsActive(false)
                      
                    } }
                    className={`calendar-item ${
                      date.active ? "" : "disabled"
                    } ${isActive ? "active" : ""}`}
                  >
                    {date.gate}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NepDatePicker;
