import React, { useEffect, useState, useRef } from "react";
import "./NepDatePicker.css";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

/**
 * @description This is a simple date picker app which will return a value of date token as callback function in onDateSelect and also add the domain of base url.
 * @param {domain:string,onDateSelect:number,selectToday:boolean,reset:boolean,dateToken:number } param0
 * @returnss
 */

const NepDatePicker = ({
  domain = "https://kavre.nivid.app",
  onDateSelect,
  selectToday,
  reset,
  dateToken,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState(null);
  const [activeDayId, setActiveDayId] = useState(null);
  const [apiYear, setApiYear] = useState(null);
  const [apiMonth, setApiMonth] = useState(null);
  const [InputDateDisplay, setInputDateDisplay] = useState("YYYY-MM-DD");
  const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const todayEngYear = new Date().getFullYear();
  const todayEngMonth = new Date().getMonth() + 1;
  const todayEngDay = new Date().getDate();


  function handlePrevBtn(year, prevMonth) {
    if (year && prevMonth) {
      setApiYear(year);
      setApiMonth(prevMonth);
    }
  }

  function handleNextBtn(year, nextMonth) {
    if (year && nextMonth) {
      setApiYear(year);
      setApiMonth(nextMonth);
    }
  }

  function displayDate(year, month, day) {
    const fullDate = `${year}-${month}-${day}`;
    setInputDateDisplay(fullDate);
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
      }
    };

    fetchDate();
  }, [apiYear, apiMonth]);

  useEffect(() => {
    if (selectToday === true && data !== null) {
      const todayData = data.monthdata.find(
        (item) =>
          item.englishYear == todayEngYear &&
          item.englishMonth == todayEngMonth &&
          item.englishDate == todayEngDay
      );

      onDateSelect(todayData.dayid);
      displayDate(todayData.year, todayData.nepaliMonth, todayData.gate);
      setActiveDayId(todayData.dayid);
    }
    if (dateToken && data !== null) {
      const givenTokenDate = data.monthdata.find(
        (item) => item.dayid == dateToken
      );
      if (givenTokenDate !== undefined) {
        displayDate(
          givenTokenDate.year,
          givenTokenDate.nepaliMonth,
          givenTokenDate.gate
        );
        setActiveDayId(givenTokenDate.dayid);
        onDateSelect && onDateSelect(givenTokenDate.dayid);
      }
    }
  }, [data, dateToken]);
  useEffect(() => {
    setInputDateDisplay("YYYY-MM-DD");
    onDateSelect && onDateSelect("");
    setActiveDayId(null);
  }, [reset]);
  const wrapperRef = useRef(null);

  useEffect(() => {
   
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="nepali-calendar-wrapper" ref={wrapperRef}>
      <div onClick={() => setIsActive(!isActive)} className="nepali-calendar">
        <input className="calendar-nepali" value={InputDateDisplay} />
      </div>
      <div>
        {data && isActive && (
          <div className="calendar">
            <div className="calendar-header">
              <div
                onClick={() => {
                  handlePrevBtn(data.prevYear, data.prevMonth);
                }}
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
                  const today =
                    date.englishMonth == todayEngMonth &&
                    date.englishDate == todayEngDay;
                  return (
                    <div
                      key={index}
                      style={{ color: date.eventColour }}
                      onClick={() => {
                        setActiveDayId(date.dayid);
                        displayDate(date.year, date.nepaliMonth, date.gate);
                        onDateSelect && onDateSelect(date.dayid);
                        setIsActive(false);
                      }}
                      className={`calendar-item ${
                        date.active ? "" : "disabled"
                      } ${isActive ? "active" : ""} ${
                        today ? "calendar-item-current" : ""
                      }`}
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
    </div>
  );
};

export default NepDatePicker;
