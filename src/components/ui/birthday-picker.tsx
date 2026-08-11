"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface BirthdayPickerProps {
  value: string;
  onChange: (date: string) => void;
}

export function BirthdayPicker({ value, onChange }: BirthdayPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return undefined;
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return undefined;
    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return undefined;
    }
    return date;
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseDate(value));

  useEffect(() => {
    setSelectedDate(parseDate(value));
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMonthDropdownOpen(false);
        setIsYearDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    setSelectedDate(newDate);
    onChange(format(newDate, "MM/dd/yyyy"));
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  // Generate years from 1900 to current year
  const years = [];
  for (let y = 1900; y <= today.getFullYear(); y++) {
    years.push(y);
  }

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date > today;

      days.push(
        <button
          key={day}
          onClick={() => handleSelect(day)}
          disabled={isPast}
          className={`
            w-8 h-8 rounded-full text-sm font-medium transition-colors
            ${isSelected ? "bg-black text-white" : ""}
            ${isToday && !isSelected ? "border border-black" : ""}
            ${!isSelected && !isPast ? "hover:bg-slate-100" : ""}
            ${isPast ? "text-slate-300 cursor-not-allowed" : "text-slate-700"}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full h-10 pl-10 pr-3 text-left border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:bg-slate-50 transition-colors"
      >
        <CalendarIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10"
          aria-hidden="true"
        />
        <span className={!selectedDate ? "text-slate-400" : ""}>
          {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select birthday"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4 w-[280px]">
          {/* Month/Year selector with separate dropdowns */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              {/* Month Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthDropdownOpen(!isMonthDropdownOpen);
                    setIsYearDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 font-semibold text-sm hover:bg-slate-100 rounded transition-colors"
                >
                  {monthNames[viewMonth]}
                  <span className="text-xs text-slate-400">▼</span>
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto min-w-[100px]">
                    {monthNames.map((month, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setViewMonth(index);
                          setIsMonthDropdownOpen(false);
                        }}
                        className={`
                          w-full px-3 py-1.5 text-sm text-left hover:bg-slate-100 transition-colors
                          ${viewMonth === index ? "bg-slate-100 font-semibold" : ""}
                        `}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearDropdownOpen(!isYearDropdownOpen);
                    setIsMonthDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 font-semibold text-sm hover:bg-slate-100 rounded transition-colors"
                >
                  {viewYear}
                  <span className="text-xs text-slate-400">▼</span>
                </button>
                {isYearDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto min-w-[100px]">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setViewYear(year);
                          setIsYearDropdownOpen(false);
                        }}
                        className={`
                          w-full px-3 py-1.5 text-sm text-left hover:bg-slate-100 transition-colors
                          ${viewYear === year ? "bg-slate-100 font-semibold" : ""}
                        `}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>

          {/* Today button */}
          <button
            type="button"
            onClick={() => {
              const todayDate = new Date();
              setViewMonth(todayDate.getMonth());
              setViewYear(todayDate.getFullYear());
              setSelectedDate(todayDate);
              onChange(format(todayDate, "MM/dd/yyyy"));
              setIsOpen(false);
            }}
            className="w-full mt-3 py-1.5 text-xs text-black font-medium border-t border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
}