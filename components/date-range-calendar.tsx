"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  className?: string;
  onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void;
  initialRange?: { start: Date | null; end: Date | null };
}

export function DateRangeCalendar({
  className,
  onRangeSelect,
  initialRange = { start: null, end: null },
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // Set current month to the month of initialRange.start if available
    return initialRange?.start || new Date();
  });

  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>(initialRange);

  const [selectionMode, setSelectionMode] = useState<"start" | "end">(() => {
    // If both start and end dates are set, we're ready to start a new selection
    if (initialRange?.start && initialRange?.end) {
      return "start";
    }
    // If only start date is set, we're waiting for an end date
    else if (initialRange?.start) {
      return "end";
    }
    // Otherwise, we're waiting for a start date
    return "start";
  });

  // Update selected range when initialRange changes
  useEffect(() => {
    setSelectedRange(initialRange);

    // If initialRange has a start date, focus the calendar on that month
    if (initialRange?.start) {
      setCurrentMonth(new Date(initialRange.start));
    }

    // Update selection mode based on the range
    if (initialRange?.start && initialRange?.end) {
      setSelectionMode("start");
    } else if (initialRange?.start) {
      setSelectionMode("end");
    } else {
      setSelectionMode("start");
    }
  }, [initialRange]);

  // Get current month and year
  const currentMonthName = currentMonth.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentMonth.getFullYear();

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;

    // Calculate total days to display (previous month days + current month days + next month days to fill grid)
    const totalDays = 42; // 6 rows of 7 days

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (
      let i = prevMonthDays - daysFromPrevMonth + 1;
      i <= prevMonthDays;
      i++
    ) {
      days.push({
        date: new Date(year, month - 1, i),
        dayOfMonth: i,
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        dayOfMonth: i,
        isCurrentMonth: true,
      });
    }

    // Add days from next month
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        dayOfMonth: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = generateCalendarDays();

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (selectionMode === "start") {
      // Start new selection
      const newRange = { start: date, end: null };
      setSelectedRange(newRange);
      setSelectionMode("end");
      onRangeSelect?.(newRange);
    } else {
      // Complete the selection
      if (selectedRange.start && date < selectedRange.start) {
        // If end date is before start date, swap them
        const newRange = { start: date, end: selectedRange.start };
        setSelectedRange(newRange);
        setSelectionMode("start");
        onRangeSelect?.(newRange);
      } else {
        const newRange = { ...selectedRange, end: date };
        setSelectedRange(newRange);
        setSelectionMode("start");
        onRangeSelect?.(newRange);
      }
    }
  };

  // Check if a date is the start of the range
  const isStartDate = (date: Date) => {
    return (
      selectedRange.start &&
      date.toDateString() === selectedRange.start.toDateString()
    );
  };

  // Check if a date is the end of the range
  const isEndDate = (date: Date) => {
    return (
      selectedRange.end &&
      date.toDateString() === selectedRange.end.toDateString()
    );
  };

  // Check if a date is within the selected range
  const isInRange = (date: Date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return date > selectedRange.start && date < selectedRange.end;
  };

  // Get position info for styling the range
  const getRangePosition = (date: Date, index: number) => {
    if (!selectedRange.start || !selectedRange.end) return null;

    const isFirstDay =
      date.toDateString() === selectedRange.start.toDateString();
    const isLastDay = date.toDateString() === selectedRange.end.toDateString();
    const isInBetween = date > selectedRange.start && date < selectedRange.end;

    // Calculate week boundaries
    const isStartOfWeek = index % 7 === 0;
    const isEndOfWeek = index % 7 === 6;

    // Get the day before and after
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const isPrevInRange =
      prevDate >= selectedRange.start && prevDate <= selectedRange.end;
    const isNextInRange =
      nextDate >= selectedRange.start && nextDate <= selectedRange.end;

    // Check if previous or next date is start/end
    const prevIsStart =
      prevDate.toDateString() === selectedRange.start.toDateString();
    const nextIsEnd =
      nextDate.toDateString() === selectedRange.end.toDateString();

    return {
      isFirstDay,
      isLastDay,
      isInBetween,
      isStartOfWeek,
      isEndOfWeek,
      isPrevInRange,
      isNextInRange,
      prevIsStart,
      nextIsEnd,
    };
  };

  // Days of the week
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div
      className={cn("p-4 rounded-lg bg-[#0a0c14] border-[#2a2d3a]", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-md text-slate-400 hover:bg-[#2a2d3a] hover:text-white"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-md font-semibold text-white">
          {currentMonthName} {currentYear}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-md text-slate-400 hover:bg-[#2a2d3a] hover:text-white"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-slate-400 text-sm py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {days.map((day, index) => {
          const isStart = isStartDate(day.date);
          const isEnd = isEndDate(day.date);
          const inRange = isInRange(day.date);
          const rangeInfo = getRangePosition(day.date, index);

          // Check if this date is today
          const isToday = day.date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={cn(
                "relative flex items-center justify-center h-10",
                // Apply background for the range - height matches the button height
                inRange && "bg-[#3b82f6]/10"
              )}
            >
              {/* Background connector for start date - height matches the cell */}
              {isStart && selectedRange.end && (
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#3b82f6]/10 z-0" />
              )}

              {/* Background connector for end date - height matches the cell */}
              {isEnd && selectedRange.start && (
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#3b82f6]/10 z-0" />
              )}

              <button
                onClick={() => handleDateClick(day.date)}
                className={cn(
                  "h-10 w-10 flex items-center justify-center relative hover:bg-[#2a2d3a] hover:text-white rounded-md transition-colors",
                  !day.isCurrentMonth && "text-slate-600",
                  day.isCurrentMonth && !isStart && !isEnd && "text-slate-300",
                  (isStart || isEnd) && "text-white",
                  // Start date styling
                  isStart && "bg-[#3b82f6] hover:bg-[#3b82f6] rounded-lg z-10",
                  // End date styling
                  isEnd && "bg-[#3b82f6] hover:bg-[#3b82f6] rounded-lg z-10"
                )}
              >
                <span className="relative z-10">{day.dayOfMonth}</span>

                {/* Small indicator dot for today's date */}
                {isToday && (
                  <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
