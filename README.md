# react-jalali-events-calendar

## React Jalali Events Calendar – Persian (Shamsi) Calendar for React & Next.js

A modern and fully customizable Jalali (Shamsi) calendar component for React and Next.js with event support, holiday detection, RTL layout, and CSS variable-based theming.

## ✨ Features:

- ✅ Accurate Gregorian ↔ Jalali date conversion
- ✅ Event & holiday support
- ✅ Holiday detection
- ✅ Tooltip with Persian & Gregorian dates
- ✅ Highlights today
- ✅ Shows previous & next month days
- ✅ Fully responsive
- ✅ RTL-first design
- ✅ External month navigation control
- ✅ Theme customization via CSS Variables
- ✅ CSS Modules scoped styling
- ✅ No external calendar dependencies

## 📦 Installation:

```bash
npm install react-jalali-events-calendar
```

or

```bash
yarn add react-jalali-events-calendar
```

## ⚠️ Next.js Users

If you are using Next.js App Router, add this at the top of your file:

```tsx
"use client";
```

## 🚀 Basic Usage:

```tsx
import { useState } from "react";
import { Calendar } from "react-jalali-events-calendar";

export default function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [goNext, setGoNext] = useState(false);
  const [goPrev, setGoPrev] = useState(false);

  return (
    <>
      <button onClick={() => setGoNext(true)}>بعدی</button>
      <button onClick={() => setGoPrev(true)}>قبلی</button>

      <div style={{ width: 350, height: 400 }}>
        <Calendar
          setCurrentDate={setCurrentDate}
          goNext={goNext}
          goPrev={goPrev}
          setNext={setGoNext}
          setPrev={setGoPrev}
          showEvents
        />
      </div>
    </>
  );
}
```

## 🧠 Props:

| Prop             | Type                       | Description                           |
| ---------------- | -------------------------- | ------------------------------------- |
| `setCurrentDate` | `(value: string) => void`  | Returns formatted current date string |
| `goNext`         | `boolean`                  | Navigate to next month                |
| `goPrev`         | `boolean`                  | Navigate to previous month            |
| `setNext`        | `(value: boolean) => void` | Reset next navigation trigger         |
| `setPrev`        | `(value: boolean) => void` | Reset previous navigation trigger     |
| `showEvents`     | `boolean`                  | Enable event tooltips                 |

## 🎨 Customization (CSS Variables)

All visual styles are controlled via CSS Variables.
You can override them globally or inside a wrapper class.

### 🌍 Global Theme Example

```css
:root {
  --weekHeaderBg: #f1f4f9;
  --weekHeaderTextColor: #23242e;
  --weekHeaderFontSize: 14px;

  --daysFontSize: 14px;

  --borderColor: #d9d7e0;

  --currentDayBg: #2563eb;
  --currentDayTextColor: #ffffff;

  --holidayBg: #ffffff;
  --holidayTextColor: #fb2c36;

  --outOfMonthBg: #ffffff;
  --outOfMonthTextColor: #99a1af;

  --tooltipBg: #ffffff;

  --tooltipHeaderBgFrom: #00a1ee;
  --tooltipHeaderBgTo: #1349e6;
  --tooltipHeaderTextColor: #ffffff;

  --tooltipHeaderHolidayBgFrom: #fb2c36;
  --tooltipHeaderHolidayBgTo: #b91c1c;

  --eventsTextColor: #23242e;
  --eventsFontSize: 12px;

  --christianDateFontSize: 11px;
  --christianDateTextColor: #23242e;
}
```

### 🎯 Scoped Theme Example

```tsx
<div className="darkCalendar">
  <Calendar {...props} />
</div>
```

```css
.darkCalendar {
  --weekHeaderBg: #1f2937;
  --weekHeaderTextColor: #ffffff;
  --currentDayBg: #10b981;
  --tooltipBg: #111827;
  --eventsTextColor: #e5e7eb;
}
```

You can render multiple calendars with different themes in the same page.

## 📡 Events Data Source:

By default, the calendar fetches events from:

```http
GET https://badesaba.ir/api/site/getDataCalendar/{month}/{year}
```

## Expected Response Shape:

```ts
type Event = {
  event: string;
  holiday: boolean;
};

type CalendarData = {
  date: string; // YYYY-MM-DD (Gregorian)
  events: Event[];
};
```

## 🧭 Tooltip Behavior

- Appears on hover
- Automatically adjusts position (left / center / right)
- Displays:
  - Jalali date
  - Gregorian date
  - Event list
- Holidays are visually highlighted

## 🛠 Built With:

- React
- Next.js (App Router compatible)
- TypeScript
- CSS Modules
- RTL layout support
- Native Jalali conversion logic (no moment, no dayjs)

## 📄 License:

MIT License
Free for personal and commercial use.

## ❤️ Contributing:

Issues and Pull Requests are welcome!
Feel free to improve or extend this calendar 🌱
