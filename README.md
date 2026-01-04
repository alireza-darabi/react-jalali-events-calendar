### 📅 Persian Calendar for React & Next.js /n
A fully customizable Persian calendar component for React and Next.js with support for events, holidays, tooltips, RTL layout, and modern UI.

✨ Features:
✅ Accurate Gregorian ↔ Jalali date conversion
✅ Event & holiday support
✅ Holiday detection
✅ Tooltip with Persian & Gregorian dates
✅ Highlights today’s date
✅ Shows previous & next month days
✅ Fully responsive
✅ RTL-first design
✅ External month navigation control
✅ No external calendar dependencies

📦 Installation:

```bash
npm install react-persian-calendar
```
or
```bash
yarn add react-persian-calendar
```

⚠️ Tailwind CSS Requirement

This calendar **requires Tailwind CSS** to be installed in your project.

All styles, layout, responsiveness, and tooltips are built using Tailwind utility classes.
Without Tailwind CSS, the calendar **will not render correctly**.

### Install Tailwind CSS

If you are using Next.js or React, follow the official guide:

👉 https://tailwindcss.com/docs/installation

After installation, make sure Tailwind is properly configured in your project.

🚀 Basic Usage:

```tsx
import { useState } from "react";
import { Calendar } from "react-persian-calendar";

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [goNext, setGoNext] = useState(false);
  const [goPrev, setGoPrev] = useState(false);

  return (
    <Calendar
      goNext={goNext}
      goPrev={goPrev}
      setCurrentDate={setCurrentDate}
      setNext={() => setGoNext(false)}
      setPrev={() => setGoPrev(false)}
    />
  );
}
```
🧠 Props:

| Prop                        | Type                       | Description                           |
| --------------------------- | -------------------------- | ------------------------------------- |
| `setCurrentDate`            | `(value: string) => void`  | Returns formatted current date string |
| `goNext`                    | `boolean`                  | Navigate to next month                |
| `goPrev`                    | `boolean`                  | Navigate to previous month            |
| `setNext`                   | `(value: boolean) => void` | Reset next navigation trigger         |
| `setPrev`                   | `(value: boolean) => void` | Reset previous navigation trigger     |
| `showEvents`                | `boolean`                  | Enable event tooltips                 |
| `headerColor`               | `string`                   | Header background color               |
| `headerTextColor`           | `string`                   | Header text color                     |
| `daysBgColor`               | `string`                   | Current month days background         |
| `daysTextColor`             | `string`                   | Current month days text color         |
| `holidaysBgColor`           | `string`                   | Holiday background color              |
| `holidayTextColor`          | `string`                   | Holiday text color                    |
| `currentDayBgColor`         | `string`                   | Today background color                |
| `currentDaytextColor`       | `string`                   | Today text color                      |
| `outsideMonthDaysBg`        | `string`                   | Outside month days background         |
| `outsideMonthDaysTextColor` | `string`                   | Outside month days text color         |
| `borderColor`               | `string`                   | Calendar border color                 |

🎨 Full Customization Example:

```tsx
<Calendar
  setCurrentDate={setCurrentDate}
  goNext={goNext}
  goPrev={goPrev}
  setNext={setGoNext}
  setPrev={setGoPrev}
  showEvents={true}
  headerColor="#F1F4F9"
  headerTextColor="#111827"
  daysBgColor="#ffffff"
  daysTextColor="#111827"
  holidaysBgColor="#FEE2E2"
  holidayTextColor="#DC2626"
  currentDayBgColor="#2563EB"
  currentDaytextColor="#ffffff"
  outsideMonthDaysBg="#F9FAFB"
  outsideMonthDaysTextColor="#9CA3AF"
  borderColor="#D1D5DB"
/>
```
📡 Events Data Source:
By default, the calendar fetches events from:
```http
GET https://badesaba.ir/api/site/getDataCalendar/{month}/{year}
```

Expected Response Shape:
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
🧭 Event Tooltip:
.Appears on hover
.Displays:
  .Jalali date
  .Gregorian date
  .Event list
.Holidays are visually highlighted


🛠 Built With:
React
Next.js (App Router compatible)
TypeScript
Tailwind CSS
RTL layout support

⚠️ Important Notes:
This component must be used inside a Client Component
Required at the top of the file:
```tsx
"use client";
```

📄 License:
MIT License
Free for personal and commercial use.

❤️ Contributing:
Issues and Pull Requests are welcome!
Feel free to improve or extend this calendar 🌱