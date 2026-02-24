"use client";
import styles from "./Calendar.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
type Event = {
  event: string;
  holiday: boolean;
};
type Props = {
  setCurrentDate: (value: string) => void;
  goNext: boolean;
  goPrev: boolean;
  showEvents?: boolean;
  setNext: (value: boolean) => void;
  setPrev: (value: boolean) => void;
};
type CalendarData = {
  date: string;
  events: Event[];
};

function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
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
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number,
): [number, number, number] {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
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
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}

function isLeapJalaliYear(jy: number): boolean {
  const fm = jy % 33;
  return (
    fm === 1 ||
    fm === 5 ||
    fm === 9 ||
    fm === 13 ||
    fm === 17 ||
    fm === 22 ||
    fm === 26 ||
    fm === 30
  );
}
function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export default function Calendar({
  setCurrentDate,
  showEvents,
  goNext,
  goPrev,
  setNext,
  setPrev,
}: Props) {
  const gregorianMonthsFa = [
    "",
    "ژانویه",
    "فوریه",
    "مارس",
    "آوریل",
    "مه",
    "ژوئن",
    "ژوئیه",
    "اوت",
    "سپتامبر",
    "اکتبر",
    "نوامبر",
    "دسامبر",
  ];

  const now = new Date();
  const tehranOffset = 3.5;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const tehranDate = new Date(utc + 3600000 * tehranOffset);
  const [gy, gm, gd] = [
    tehranDate.getFullYear(),
    tehranDate.getMonth() + 1,
    tehranDate.getDate(),
  ];
  const [todayYear, todayMonth, todayDate] = gregorianToJalali(gy, gm, gd);
  const [currentYear, setCurrentYear] = useState(todayYear);
  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);

  const weekDays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
  ];

  // Fetch calendar data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://badesaba.ir/api/site/getDataCalendar/${currentMonth}/${currentYear}`,
        );
        const data = await response.json();
        setCalendarData(data);
      } catch {
        console.log("Error fetching calendar data:");
      }
    };
    fetchData();
  }, [currentMonth, currentYear]);

  // Update current date display whenever currentMonth or currentYear changes
  useEffect(() => {
    const weekDays = [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ];

    const months = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    // تاریخ میلادی فعلی تهران
    const now = new Date();
    const tehranOffset = 3.5;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const tehranDate = new Date(utc + 3600000 * tehranOffset);

    const [gy, gm, gd] = [
      tehranDate.getFullYear(),
      tehranDate.getMonth() + 1,
      tehranDate.getDate(),
    ];

    // تبدیل به شمسی
    const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);

    // محاسبه روز هفته
    const weekdayIndex = tehranDate.getDay(); // 0 = Sunday
    const weekdayName = weekDays[(weekdayIndex + 1) % 7]; // تبدیل به شنبه اول

    const monthName = months[jm - 1];

    setCurrentDate(`${weekdayName}، ${jd} ${monthName} ${jy}`);
  }, [currentMonth, currentYear]);

  const days = useMemo(() => {
    const result: {
      year: number;
      month: number;
      date: number;
      currentMonth: boolean;
    }[] = [];

    const daysInMonth = jalaliMonthLength(currentYear, currentMonth);

    const [startGy, startGm, startGd] = jalaliToGregorian(
      currentYear,
      currentMonth,
      1,
    );
    const startDate = new Date(startGy, startGm - 1, startGd);
    const firstDayOfWeek = (startDate.getDay() + 1) % 7;

    // prev month
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
        currentMonth: false,
      });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        year: currentYear,
        month: currentMonth,
        date: i,
        currentMonth: true,
      });
    }

    // next month
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
        currentMonth: false,
      });
    }

    return result;
  }, [currentYear, currentMonth]);

  // Handle month navigation

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
  // Find events for a specific date
  const calendarMap = useMemo(() => {
    const map = new Map<string, Event[]>();
    calendarData.forEach((item) => {
      map.set(item.date, item.events);
    });
    return map;
  }, [calendarData]);

  const getEventsForDate = (year: number, month: number, date: number) => {
    const [gy, gm, gd] = jalaliToGregorian(year, month, date);
    const key = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(
      2,
      "0",
    )}`;
    return calendarMap.get(key) ?? [];
  };

  return (
    <div className={styles.calendarContainer} dir="rtl">
      {/* Weekdays */}
      <div className={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <p key={index}>{day}</p>
        ))}
      </div>
      <div className={styles.weekHeaderMobile}>
        {weekDays.map((day, index) => (
          <p key={index}>{day[0]}</p>
        ))}
      </div>

      {/* Calendar days */}
      <div className={styles.daysContainer}>
        {days.map((d, i) => {
          const events = getEventsForDate(d.year, d.month, d.date);
          const isHolidayDay = events.some((event) => event.holiday);
          const columnIndex = i % 7; // Determine column (0 to 6)
          let tooltipPosition = "";
          if (columnIndex <= 1) {
            tooltipPosition = "r"; // Left side
          } else if (columnIndex >= 5) {
            tooltipPosition = "l"; // Right side
          } else {
            tooltipPosition = "m"; // Center
          }

          return (
            <div
              key={i}
              className={`${styles.dayCell} ${d.currentMonth ? "" : styles.anotherMonth}
      ${
        d.year === todayYear &&
        d.month === todayMonth &&
        d.date === todayDate &&
        d.currentMonth
          ? styles.currentDayCell
          : ""
      }
      ${isHolidayDay && d.currentMonth ? styles.holidayCell : ""}
    `}
            >
              {d.date}

              {showEvents && d.currentMonth && (
                <div
                  className={`${styles.tooltipContainer} ${tooltipPosition == "r" ? styles.rightTooltip : tooltipPosition == "l" ? styles.leftTooltip : tooltipPosition == "m" ? styles.centerTooltip : ""}
        `}
                >
                  {(() => {
                    const [gy2, gm2, gd2] = jalaliToGregorian(
                      d.year,
                      d.month,
                      d.date,
                    );
                    const gregorianMonthName = gregorianMonthsFa[gm2];

                    return (
                      <>
                        <div
                          className={`
                            ${styles.tooltipHeader}
                  ${isHolidayDay ? styles.tooltipHeaderHoliday : ""}
                `}
                        >
                          <span>{weekDays[i % 7]}</span>
                          <span>
                            {d.year}/{d.month}/{d.date}
                          </span>
                        </div>

                        {/*تاریخ میلادی */}
                        <div
                          className={`${styles.christianDate} ${isHolidayDay ? styles.christianDateHoliday : ""}`}
                        >
                          {gd2} {gregorianMonthName} {gy2}
                        </div>

                        {/* رویدادها */}
                        {events.length > 0 ? (
                          <div className={styles.eventsContainer}>
                            <ul
                              className={`${styles.eventsList} ${isHolidayDay ? styles.eventsListHoliday : ""}`}
                            >
                              {events.map((event, index) => (
                                <li key={index}>{event.event}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className={styles.noEvents}>رویدادی وجود ندارد</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
