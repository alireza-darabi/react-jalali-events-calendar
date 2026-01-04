import * as react_jsx_runtime from 'react/jsx-runtime';

type Props = {
    setCurrentDate: (value: string) => void;
    goNext: boolean;
    goPrev: boolean;
    headerColor?: string;
    headerTextColor?: string;
    showEvents?: boolean;
    holidaysBgColor?: string;
    daysTextColor?: string;
    currentDayBgColor?: string;
    currentDaytextColor?: string;
    holidayTextColor?: string;
    daysBgColor?: string;
    outsideMonthDaysBg?: string;
    outsideMonthDaysTextColor?: string;
    borderColor?: string;
    setNext: (value: boolean) => void;
    setPrev: (value: boolean) => void;
};
declare function Calendar({ setCurrentDate, headerColor, showEvents, goNext, goPrev, headerTextColor, setNext, daysBgColor, setPrev, holidaysBgColor, daysTextColor, holidayTextColor, currentDayBgColor, currentDaytextColor, borderColor, outsideMonthDaysBg, outsideMonthDaysTextColor, }: Props): react_jsx_runtime.JSX.Element;

export { Calendar };
