"use client";

import React, { useState, useEffect } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Cloud,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarView, Campaign, TimePeriod, TimeSlot } from "@/app/types";

interface GoogleCalendarProps {
  campaign: Campaign;
  campaigns: Campaign[];
  onSelectTimePeriods: (timeSlots: TimeSlot[]) => void;
}

export function GoogleCalendar({
  campaign,
  campaigns,
  onSelectTimePeriods,
}: GoogleCalendarProps) {
  const today = startOfToday();
  const [selectedTimePeriods, setSelectedTimePeriods] = useState<TimeSlot[]>(
    campaign.selectedTimePeriods || []
  );
  const [currentDate, setCurrentDate] = useState(today);
  const [view, setView] = useState<CalendarView>("month");

  // Price surge data (example data - in a real app this would come from an API)
  const priceSurgeDates = [
    addDays(today, 2),
    addDays(today, 3),
    addDays(today, 7),
    addDays(today, 8),
    addDays(today, 15),
  ];

  // Update parent component when time periods change
  useEffect(() => {
    const isDifferent =
      selectedTimePeriods.length !== campaign.selectedTimePeriods.length ||
      selectedTimePeriods.some((timeSlot, i) => {
        const campaignTimeSlot = campaign.selectedTimePeriods[i];
        return (
          !campaignTimeSlot ||
          !isSameDay(timeSlot.date, campaignTimeSlot.date) ||
          timeSlot.period !== campaignTimeSlot.period
        );
      });

    if (isDifferent) {
      onSelectTimePeriods(selectedTimePeriods);
    }
  }, [selectedTimePeriods, campaign.selectedTimePeriods, onSelectTimePeriods]);

  // Navigation functions
  const next = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const prev = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, -1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, -1));
    else setCurrentDate(addMonths(currentDate, -1));
  };

  const goToToday = () => {
    setCurrentDate(today);
  };

  // Time period selection handler
  const handleTimePeriodSelect = (day: Date, period: TimePeriod) => {
    setSelectedTimePeriods((prev) => {
      // Check if this time period is already selected
      const isSelected = prev.some(
        (slot) => isSameDay(slot.date, day) && slot.period === period
      );

      if (isSelected) {
        // Remove if already selected
        return prev.filter(
          (slot) => !(isSameDay(slot.date, day) && slot.period === period)
        );
      } else {
        // Add if not selected
        return [...prev, { date: day, period }];
      }
    });
  };

  // Check if a specific time period is selected
  const isTimePeriodSelected = (day: Date, period: TimePeriod) => {
    return selectedTimePeriods.some(
      (slot) => isSameDay(slot.date, day) && slot.period === period
    );
  };

  // Check if a date has campaigns scheduled
  const hasCampaigns = (day: Date) => {
    return campaigns.some(
      (c) =>
        c.selectedTimePeriods.some((slot) => isSameDay(slot.date, day)) ||
        c.selectedDates.some((d) => d instanceof Date && isSameDay(d, day))
    );
  };

  // Get campaigns for a specific date
  const getCampaignsForDate = (day: Date) => {
    return campaigns.filter(
      (c) =>
        c.selectedTimePeriods.some((slot) => isSameDay(slot.date, day)) ||
        c.selectedDates.some((d) => d instanceof Date && isSameDay(d, day))
    );
  };

  // Get campaigns for a specific time period
  const getCampaignsForTimePeriod = (day: Date, period: TimePeriod) => {
    return campaigns.filter((c) =>
      c.selectedTimePeriods.some(
        (slot) => isSameDay(slot.date, day) && slot.period === period
      )
    );
  };

  // Check if a date has a price surge
  const hasPriceSurge = (day: Date) => {
    return priceSurgeDates.some((d) => isSameDay(d, day));
  };

  // Check if a specific time period has a price surge
  const hasTimePeriodPriceSurge = (day: Date, period: TimePeriod) => {
    if (!hasPriceSurge(day)) return false;

    // Night periods are more expensive
    if (period === "4PM-12AM") return true;

    // Afternoon periods on weekends are more expensive
    if (period === "8AM-4PM") {
      const dayOfWeek = day.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    }

    return false;
  };

  // Generate days for month view
  const generateMonthDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Generate days for week view
  const generateWeekDays = () => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Generate hours for day/week view
  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  // Get icon for time period
  const getTimePeriodIcon = (period: TimePeriod) => {
    switch (period) {
      case "12AM-8AM":
        return <Moon className="h-3 w-3" />;
      case "8AM-4PM":
        return <Sun className="h-3 w-3" />;
      case "4PM-12AM":
        return <Cloud className="h-3 w-3" />;
    }
  };

  // Get color for time period
  const getTimePeriodColor = (period: TimePeriod) => {
    switch (period) {
      case "12AM-8AM":
        return "bg-indigo-800";
      case "8AM-4PM":
        return "bg-yellow-500";
      case "4PM-12AM":
        return "bg-blue-500";
    }
  };

  // Get text color for time period
  const getTimePeriodTextColor = (period: TimePeriod) => {
    switch (period) {
      case "12AM-8AM":
        return "text-indigo-400";
      case "8AM-4PM":
        return "text-yellow-500";
      case "4PM-12AM":
        return "text-blue-500";
    }
  };

  // Render month view
  const renderMonthView = () => {
    const days = generateMonthDays();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timePeriods: TimePeriod[] = ["12AM-8AM", "8AM-4PM", "4PM-12AM"];

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-7 gap-px bg-[#2a2d3a]">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-[#151825] py-2 text-center text-sm font-medium text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-[3px] bg-[#2a2d3a]">
          {days.map((day) => {
            const isPriceSurge = hasPriceSurge(day);

            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[100px] bg-[#0a0c14] flex flex-col",
                  !isSameMonth(day, currentDate) &&
                    "bg-[#0a0c14]/50 text-gray-500",
                  isToday(day) && "border-l-2 border-blue-500"
                )}
              >
                {/* Date header */}
                <div className="flex justify-between p-1 border-b border-[#2a2d3a]">
                  <span
                    className={cn(
                      "h-6 w-6 flex items-center justify-center text-sm",
                      isToday(day) && "bg-blue-500 text-white rounded-full"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {isPriceSurge && (
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  )}
                </div>

                {/* Time periods */}
                <div className="flex-1 flex flex-col divide-y divide-[#2a2d3a]">
                  {timePeriods.map((period) => {
                    const isSelected = isTimePeriodSelected(day, period);
                    const hasPeriodPriceSurge = hasTimePeriodPriceSurge(
                      day,
                      period
                    );
                    const campaignsForPeriod = getCampaignsForTimePeriod(
                      day,
                      period
                    );
                    const hasCampaignsInPeriod = campaignsForPeriod.length > 0;

                    return (
                      <div
                        key={`${day}-${period}`}
                        className={cn(
                          "flex-1 p-1 relative hover:bg-[#151825] cursor-pointer group",
                          isSelected && "bg-blue-600/10",
                          !isSameMonth(day, currentDate) && "opacity-50"
                        )}
                        onClick={() => handleTimePeriodSelect(day, period)}
                      >
                        {/* Period indicator */}
                        <div className="flex items-center gap-1 text-xs mb-1">
                          <span className={getTimePeriodTextColor(period)}>
                            {getTimePeriodIcon(period)}
                          </span>
                          <span className="capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                            {period}
                          </span>
                          {hasPeriodPriceSurge && (
                            <span className="h-2 w-2 rounded-full bg-yellow-500 ml-auto" />
                          )}
                        </div>

                        {/* Campaign blocks */}
                        <div className="space-y-1 overflow-hidden max-h-[calc(100%-20px)]">
                          {hasCampaignsInPeriod &&
                            campaignsForPeriod.map((camp) => (
                              <div
                                key={`${camp.id}-${period}`}
                                className="text-xs rounded px-1 py-0.5 truncate"
                                style={{
                                  backgroundColor: camp.color,
                                  color: "white",
                                }}
                              >
                                {camp.name}
                              </div>
                            ))}
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
                        )}

                        {/* Add button (only visible on hover) */}
                        <button
                          className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 hover:bg-blue-600 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTimePeriodSelect(day, period);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view (keeping the original implementation)
  const renderWeekView = () => {
    const days = generateWeekDays();
    const hours = generateHours();

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-8 gap-px bg-[#2a2d3a]">
          <div className="bg-[#151825] py-2 text-center text-sm font-medium text-gray-400">
            GMT
          </div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "bg-[#151825] py-2 text-center",
                isToday(day) && "bg-blue-500/10"
              )}
            >
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div
                className={cn(
                  "text-lg mt-1",
                  isToday(day) &&
                    "bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mx-auto"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex-1 grid grid-cols-8 gap-px bg-[#2a2d3a] overflow-y-auto"
          style={{ height: "calc(100vh - 250px)" }}
        >
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="bg-[#0a0c14] p-1 text-xs text-right text-gray-400 pr-2 sticky left-0">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
              {days.map((day) => {
                const isPriceSurge =
                  hasPriceSurge(day) && hour >= 17 && hour <= 22;
                const dayHasCampaigns = hasCampaigns(day);
                const campaignsForDay = getCampaignsForDate(day);
                const hasTimeSlot = campaign.selectedTimeSlots.includes(hour);

                return (
                  <div
                    key={`${day}-${hour}`}
                    className={cn(
                      "bg-[#0a0c14] hover:bg-[#151825] border-b border-[#2a2d3a] relative min-h-[50px]",
                      isToday(day) && "bg-[#0a0c14]/80",
                      hasTimeSlot && "bg-blue-600/10",
                      isPriceSurge && "bg-yellow-500/5"
                    )}
                  >
                    {/* Campaign blocks that match this hour */}
                    {dayHasCampaigns &&
                      campaignsForDay.map(
                        (camp) =>
                          camp.selectedTimeSlots.includes(hour) && (
                            <div
                              key={`${camp.id}-${hour}`}
                              className="absolute inset-x-0 mx-0.5 rounded px-1 py-0.5 text-xs truncate"
                              style={{
                                backgroundColor: camp.color,
                                color: "white",
                              }}
                            >
                              {camp.name}
                            </div>
                          )
                      )}

                    {/* Price surge indicator */}
                    {isPriceSurge && (
                      <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-500" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render day view (keeping the original implementation)
  const renderDayView = () => {
    const hours = generateHours();

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-2 gap-px bg-[#2a2d3a]">
          <div className="bg-[#151825] py-2 text-center text-sm font-medium text-gray-400">
            GMT
          </div>
          <div
            className={cn(
              "bg-[#151825] py-2 text-center",
              isToday(currentDate) && "bg-blue-500/10"
            )}
          >
            <div className="text-sm font-medium">
              {format(currentDate, "EEEE")}
            </div>
            <div
              className={cn(
                "text-lg mt-1",
                isToday(currentDate) &&
                  "bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mx-auto"
              )}
            >
              {format(currentDate, "d")}
            </div>
          </div>
        </div>
        <div
          className="flex-1 grid grid-cols-2 gap-px bg-[#2a2d3a] overflow-y-auto"
          style={{ height: "calc(100vh - 250px)" }}
        >
          {hours.map((hour) => {
            const isPriceSurge =
              hasPriceSurge(currentDate) && hour >= 17 && hour <= 22;
            const dayHasCampaigns = hasCampaigns(currentDate);
            const campaignsForDay = getCampaignsForDate(currentDate);
            const hasTimeSlot = campaign.selectedTimeSlots.includes(hour);

            return (
              <React.Fragment key={hour}>
                <div className="bg-[#0a0c14] p-1 text-xs text-right text-gray-400 pr-2 sticky left-0">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </div>
                <div
                  className={cn(
                    "bg-[#0a0c14] hover:bg-[#151825] border-b border-[#2a2d3a] relative min-h-[50px]",
                    isToday(currentDate) && "bg-[#0a0c14]/80",
                    hasTimeSlot && "bg-blue-600/10",
                    isPriceSurge && "bg-yellow-500/5"
                  )}
                >
                  {/* Campaign blocks that match this hour */}
                  {dayHasCampaigns &&
                    campaignsForDay.map(
                      (camp) =>
                        camp.selectedTimeSlots.includes(hour) && (
                          <div
                            key={`${camp.id}-${hour}`}
                            className="absolute inset-x-0 mx-0.5 rounded px-1 py-0.5 text-xs truncate"
                            style={{
                              backgroundColor: camp.color,
                              color: "white",
                            }}
                          >
                            {camp.name}
                          </div>
                        )
                    )}

                  {/* Price surge indicator */}
                  {isPriceSurge && (
                    <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-500" />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full border border-[#2a2d3a] rounded-md overflow-hidden">
      <div className="bg-[#151825] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#0a0c14] border-[#2a2d3a]"
            onClick={goToToday}
          >
            Today
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold">
            {view === "day"
              ? format(currentDate, "MMMM d, yyyy")
              : view === "week"
              ? `${format(startOfWeek(currentDate), "MMM d")} - ${format(
                  endOfWeek(currentDate),
                  "MMM d, yyyy"
                )}`
              : format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            className={view !== "day" ? "bg-[#0a0c14] border-[#2a2d3a]" : ""}
            onClick={() => setView("day")}
          >
            Day
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            className={view !== "week" ? "bg-[#0a0c14] border-[#2a2d3a]" : ""}
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            className={view !== "month" ? "bg-[#0a0c14] border-[#2a2d3a]" : ""}
            onClick={() => setView("month")}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>

      <div className="bg-[#151825] p-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full border border-yellow-500" />
            <span>Premium Pricing</span>
          </div>
          <div className="flex items-center gap-1">
            <Sun className="h-3 w-3 text-yellow-500" />
            <span>Morning (6AM-12PM)</span>
          </div>
          <div className="flex items-center gap-1">
            <Cloud className="h-3 w-3 text-blue-500" />
            <span>Afternoon (12PM-6PM)</span>
          </div>
          <div className="flex items-center gap-1">
            <Moon className="h-3 w-3 text-indigo-400" />
            <span>Night (6PM-6AM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
