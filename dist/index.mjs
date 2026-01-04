// src/Calendar.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 355666 + 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm, jd;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + days % 31;
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + (days - 186) % 30;
  }
  return [jy, jm, jd];
}
function jalaliToGregorian(jy, jm, jd) {
  jy += 1595;
  let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [
    0,
    31,
    gy % 4 === 0 && gy % 100 !== 0 || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  let gm;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}
function isLeapJalaliYear(jy) {
  const fm = jy % 33;
  return fm === 1 || fm === 5 || fm === 9 || fm === 13 || fm === 17 || fm === 22 || fm === 26 || fm === 30;
}
function jalaliMonthLength(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}
function Calendar({
  setCurrentDate,
  headerColor,
  showEvents,
  goNext,
  goPrev,
  headerTextColor,
  setNext,
  daysBgColor,
  setPrev,
  holidaysBgColor,
  daysTextColor,
  holidayTextColor,
  currentDayBgColor,
  currentDaytextColor,
  borderColor,
  outsideMonthDaysBg,
  outsideMonthDaysTextColor
}) {
  const gregorianMonthsFa = [
    "",
    "\u0698\u0627\u0646\u0648\u06CC\u0647",
    "\u0641\u0648\u0631\u06CC\u0647",
    "\u0645\u0627\u0631\u0633",
    "\u0622\u0648\u0631\u06CC\u0644",
    "\u0645\u0647",
    "\u0698\u0648\u0626\u0646",
    "\u0698\u0648\u0626\u06CC\u0647",
    "\u0627\u0648\u062A",
    "\u0633\u067E\u062A\u0627\u0645\u0628\u0631",
    "\u0627\u06A9\u062A\u0628\u0631",
    "\u0646\u0648\u0627\u0645\u0628\u0631",
    "\u062F\u0633\u0627\u0645\u0628\u0631"
  ];
  const now = /* @__PURE__ */ new Date();
  const tehranOffset = 3.5;
  const utc = now.getTime() + now.getTimezoneOffset() * 6e4;
  const tehranDate = new Date(utc + 36e5 * tehranOffset);
  const [gy, gm, gd] = [
    tehranDate.getFullYear(),
    tehranDate.getMonth() + 1,
    tehranDate.getDate()
  ];
  const [todayYear, todayMonth, todayDate] = gregorianToJalali(gy, gm, gd);
  const [currentYear, setCurrentYear] = useState(todayYear);
  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const [calendarData, setCalendarData] = useState([]);
  const weekDays = [
    "\u0634\u0646\u0628\u0647",
    "\u06CC\u06A9\u0634\u0646\u0628\u0647",
    "\u062F\u0648\u0634\u0646\u0628\u0647",
    "\u0633\u0647\u200C\u0634\u0646\u0628\u0647",
    "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
    "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647",
    "\u062C\u0645\u0639\u0647"
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://badesaba.ir/api/site/getDataCalendar/${currentMonth}/${currentYear}`
        );
        const data = await response.json();
        setCalendarData(data);
      } catch {
        console.log("Error fetching calendar data:");
      }
    };
    fetchData();
  }, [currentMonth, currentYear]);
  useEffect(() => {
    const weekDays2 = [
      "\u0634\u0646\u0628\u0647",
      "\u06CC\u06A9\u0634\u0646\u0628\u0647",
      "\u062F\u0648\u0634\u0646\u0628\u0647",
      "\u0633\u0647\u200C\u0634\u0646\u0628\u0647",
      "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
      "\u067E\u0646\u062C\u0634\u0646\u0628\u0647",
      "\u062C\u0645\u0639\u0647"
    ];
    const months = [
      "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646",
      "\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A",
      "\u062E\u0631\u062F\u0627\u062F",
      "\u062A\u06CC\u0631",
      "\u0645\u0631\u062F\u0627\u062F",
      "\u0634\u0647\u0631\u06CC\u0648\u0631",
      "\u0645\u0647\u0631",
      "\u0622\u0628\u0627\u0646",
      "\u0622\u0630\u0631",
      "\u062F\u06CC",
      "\u0628\u0647\u0645\u0646",
      "\u0627\u0633\u0641\u0646\u062F"
    ];
    const now2 = /* @__PURE__ */ new Date();
    const tehranOffset2 = 3.5;
    const utc2 = now2.getTime() + now2.getTimezoneOffset() * 6e4;
    const tehranDate2 = new Date(utc2 + 36e5 * tehranOffset2);
    const [gy2, gm2, gd2] = [
      tehranDate2.getFullYear(),
      tehranDate2.getMonth() + 1,
      tehranDate2.getDate()
    ];
    const [jy, jm, jd] = gregorianToJalali(gy2, gm2, gd2);
    const weekdayIndex = tehranDate2.getDay();
    const weekdayName = weekDays2[(weekdayIndex + 1) % 7];
    const monthName = months[jm - 1];
    setCurrentDate(`${weekdayName}\u060C ${jd} ${monthName} ${jy}`);
  }, [currentMonth, currentYear]);
  const days = useMemo(() => {
    const result = [];
    const daysInMonth = jalaliMonthLength(currentYear, currentMonth);
    const [startGy, startGm, startGd] = jalaliToGregorian(
      currentYear,
      currentMonth,
      1
    );
    const startDate = new Date(startGy, startGm - 1, startGd);
    const firstDayOfWeek = (startDate.getDay() + 1) % 7;
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }
    const prevDaysInMonth = jalaliMonthLength(prevYear, prevMonth);
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = prevDaysInMonth - firstDayOfWeek + 1 + i;
      result.push({
        year: prevYear,
        month: prevMonth,
        date,
        currentMonth: false
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        year: currentYear,
        month: currentMonth,
        date: i,
        currentMonth: true
      });
    }
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    let nextDate = 1;
    while (result.length < 42) {
      result.push({
        year: nextYear,
        month: nextMonth,
        date: nextDate++,
        currentMonth: false
      });
    }
    return result;
  }, [currentYear, currentMonth]);
  const handlePrevMonth = useCallback(() => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setPrev(false);
  }, [currentMonth, currentYear]);
  const handleNextMonth = useCallback(() => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setNext(false);
  }, [currentMonth, currentYear]);
  useEffect(() => {
    if (goNext) {
      handleNextMonth();
    }
    if (goPrev) {
      handlePrevMonth();
    }
  }, [goNext, goPrev, handleNextMonth, handlePrevMonth]);
  const calendarMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    calendarData.forEach((item) => {
      map.set(item.date, item.events);
    });
    return map;
  }, [calendarData]);
  const getEventsForDate = (year, month, date) => {
    var _a;
    const [gy2, gm2, gd2] = jalaliToGregorian(year, month, date);
    const key = `${gy2}-${String(gm2).padStart(2, "0")}-${String(gd2).padStart(
      2,
      "0"
    )}`;
    return (_a = calendarMap.get(key)) != null ? _a : [];
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto h-full flex flex-col", dir: "rtl", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          ...headerTextColor ? { color: headerTextColor } : {},
          ...headerColor ? { backgroundColor: headerColor } : { backgroundColor: "#F1F4F9" },
          ...borderColor ? { borderColor } : { borderColor: "#d9d7e0" }
        },
        className: `grid-cols-7  hidden 350:grid text-center bg-[#F1F4F9] border border-b-0  font-semibold rounded-t-[10px] py-2.5`,
        children: weekDays.map((day, index) => /* @__PURE__ */ jsx("p", { className: "350:text-[13px]", children: day }, index))
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          backgroundColor: headerColor ? headerColor : "#F1F4F9"
        },
        className: `grid-cols-7 grid 350:hidden text-center bg-[#F1F4F9] font-semibold rounded-t-[10px] py-2.5`,
        children: weekDays.map((day, index) => /* @__PURE__ */ jsx("p", { className: "text-12 350:hidden", children: day[0] }, index))
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: borderColor ? { borderColor } : { borderColor: "#d9d7e0" },
        className: "grid grid-cols-7 flex-1  border-l-0 border-b-0 border",
        children: days.map((d, i) => {
          const events = getEventsForDate(d.year, d.month, d.date);
          const isHolidayDay = events.some((event) => event.holiday);
          const columnIndex = i % 7;
          let tooltipPosition = "";
          if (columnIndex <= 1) {
            tooltipPosition = "right-0";
          } else if (columnIndex >= 5) {
            tooltipPosition = "left-0";
          } else {
            tooltipPosition = "left-1/2 -translate-x-1/2";
          }
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                ...!d.currentMonth && outsideMonthDaysBg ? { backgroundColor: outsideMonthDaysBg } : {},
                ...!d.currentMonth && outsideMonthDaysTextColor ? { color: outsideMonthDaysTextColor } : !d.currentMonth ? { color: "#99a1af " } : {},
                ...daysBgColor && d.currentMonth ? { backgroundColor: daysBgColor } : {},
                ...daysTextColor && d.currentMonth ? { color: daysTextColor } : {},
                ...holidayTextColor && isHolidayDay && d.currentMonth ? { color: holidayTextColor } : {},
                ...isHolidayDay && holidaysBgColor && d.currentMonth ? { backgroundColor: holidaysBgColor } : {},
                ...d.year === todayYear && d.month === todayMonth && d.date === todayDate && d.currentMonth && currentDayBgColor ? { backgroundColor: currentDayBgColor } : {},
                ...d.year === todayYear && d.month === todayMonth && d.date === todayDate && d.currentMonth && currentDaytextColor ? { backgroundColor: currentDaytextColor } : {},
                ...borderColor ? { borderColor } : { borderColor: "#d9d7e0" }
              },
              className: `
       border-r-0 border-t-0 border p-[5px] 
      flex justify-center items-center 390:text-14 390:p-[10px] 700:p-[15px] 
      relative text-12 group
      ${d.currentMonth ? "" : ""}
      ${d.year === todayYear && d.month === todayMonth && d.date === todayDate && d.currentMonth ? "bg-blue-500 text-white" : ""}
      ${isHolidayDay && d.currentMonth ? "text-red-500" : ""}
    `,
              children: [
                d.date,
                showEvents && d.currentMonth && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `
          absolute hidden group-hover:block
          bg-white border z-50 border-gray-300 overflow-hidden rounded shadow-lg
          top-full mt-2 w-[220px] text-sm text-right ${tooltipPosition}
        `,
                    children: (() => {
                      const [gy2, gm2, gd2] = jalaliToGregorian(
                        d.year,
                        d.month,
                        d.date
                      );
                      const gregorianMonthName = gregorianMonthsFa[gm2];
                      return /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: `
                  flex p-2 justify-between mb-2 pb-2 
                  bg-linear-to-r from-[#00A1EE] to-[#1349E6] font-semibold text-white
                  ${isHolidayDay ? "from-red-500 via-red-600 to-rose-700" : ""}
                `,
                            children: [
                              /* @__PURE__ */ jsx("span", { children: weekDays[i % 7] }),
                              /* @__PURE__ */ jsxs("span", { children: [
                                d.year,
                                "/",
                                d.month,
                                "/",
                                d.date
                              ] })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "text-[11px] px-2 text-gray-700 mb-2 pb-2 border-b border-gray-200", children: [
                          gd2,
                          " ",
                          gregorianMonthName,
                          " ",
                          gy2
                        ] }),
                        events.length > 0 ? /* @__PURE__ */ jsx("div", { className: "p-2 pt-0", children: /* @__PURE__ */ jsx("ul", { className: "list-disc pr-4 flex flex-col", children: events.map((event, index) => /* @__PURE__ */ jsx(
                          "li",
                          {
                            className: `text-10 ${isHolidayDay ? "text-red-600" : "text-[#23242e]"}`,
                            children: event.event
                          },
                          index
                        )) }) }) : /* @__PURE__ */ jsx("p", { className: "text-10 p-2 pt-0 text-[#23242e]", children: "\u0631\u0648\u06CC\u062F\u0627\u062F\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F" })
                      ] });
                    })()
                  }
                )
              ]
            },
            i
          );
        })
      }
    )
  ] });
}
export {
  Calendar
};
