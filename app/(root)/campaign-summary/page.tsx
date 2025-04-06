"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScheduleMeet from "@/components/shared/ScheduleMeet";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const Page = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const dates = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1
  );

  const times = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
  ];

  const handleMonthChange = (increment: number) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSelectedDate(null); // Reset selected date when month changes
  };
  return (
    <div className="mt-24 py-5  z-50 wrapper w-full">
      <h2 className="text-2xl 2xl:text-3xl font-bold text-white text-center mb-8 2xl:mb-10 2xl:mt-4 w-full">
        Campaign Summary
      </h2>
      <div className="flex flex-col h-[62%]  pb-10 lg:flex-row  items-start justify-between gap-8 sm:gap-4 xl:gap-6 w-full">
        <SlotCarousel />
        <div className="bg-[#0B111B]  flex-1 w-full h-full  border border-[#FFFFFF33] rounded-[12px] flex items-start gap-4    flex-col ">
          <div className="p-5 2xl:px-5 2xl:py-8 w-full  ">
            <div className="flex items-center    gap-4">
              <p className="2xl:text-xl text-lg font-semibold text-white">
                Projected campaign details
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-3 2xl:p-3.5 border rounded-[8px] flex gap-4 bg-[#141C2A]  border-[#FFFFFF33] items-center ">
                <div className="w-[40px] h-[40px] p-2.5 rounded-full bg-[#293E6180]">
                  <Image
                    alt="hehe"
                    src="/impression.svg"
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-xs 2xl:text-sm mb-1 capitalize text-primary-500">
                    Total Projected Impressions
                  </p>
                  <p className=" font-semibold text-white 2xl:text-lg">
                    1.5B - 2.5B
                  </p>
                </div>
              </div>
              <div className="p-3 2xl:p-3.5 border rounded-[8px] flex gap-4 bg-[#141C2A]  border-[#FFFFFF33] items-center ">
                <div className="w-[40px] h-[40px] p-2.5 rounded-full bg-[#293E6180]">
                  <Image
                    alt="hehe"
                    src="/clock.svg"
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-xs 2xl:text-sm mb-1 capitalize text-primary-500">
                    Duration
                  </p>
                  <p className=" font-semibold text-white 2xl:text-lg">
                    1 Month
                  </p>
                </div>
              </div>
              <div className="p-3 2xl:p-3.5 border rounded-[8px] flex gap-4 bg-[#141C2A]  border-[#FFFFFF33] items-center ">
                <div className="w-[40px] h-[40px] p-2.5 rounded-full bg-[#293E6180]">
                  <Image
                    alt="hehe"
                    src="/player.svg"
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-xs 2xl:text-sm mb-1 capitalize text-primary-500">
                    Total GenZ Players
                  </p>
                  <p className=" font-semibold text-white 2xl:text-lg">
                    1.5B - 2.5B
                  </p>
                </div>
              </div>
              <div className="p-3 2xl:p-3.5 border rounded-[8px] flex gap-4 bg-[#141C2A]  border-[#FFFFFF33] items-center ">
                <div className="w-[40px] h-[40px] p-2.5 rounded-full bg-[#293E6180]">
                  <Image
                    alt="hehe"
                    src="/chart.svg"
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-xs 2xl:text-sm mb-1 capitalize text-primary-500">
                    Campaign Performance
                  </p>
                  <p className=" font-semibold text-white 2xl:text-lg">97%</p>
                </div>
              </div>
            </div>
            <div className="flex items-center    gap-4">
              <p className="2xl:text-xl text-lg font-semibold text-white">
                Schedule a meeting to finalize booking
              </p>
            </div>
            <div className="bg-gray-900 border border-[#FFFFFF33] rounded-[10px] mt-4 text-white p-6 ">
              {step === 1 && (
                <>
                  {/* Month selection */}
                  <div className="flex items-center justify-evenly mb-6">
                    <button
                      onClick={() => handleMonthChange(-1)}
                      className="p-2 rounded-lg bg-[#1E293B] hover:bg-gray-700"
                    >
                      <FaChevronLeft />
                    </button>
                    <span className="font-semibold">
                      {months[selectedMonth - 1]} {selectedYear}
                    </span>
                    <button
                      onClick={() => handleMonthChange(1)}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  {/* Date grid */}
                  <div className="grid grid-cols-7 gap-2 mb-2 ">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm text-gray-400 p-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {dates.map((date) => {
                      const dateObj = new Date(
                        selectedYear,
                        selectedMonth - 1,
                        date
                      );
                      const dayOfWeek = dateObj.getDay();
                      const isToday =
                        date === new Date().getDate() &&
                        selectedMonth === new Date().getMonth() + 1 &&
                        selectedYear === new Date().getFullYear();

                      return (
                        <button
                          key={date}
                          className={`p-2 rounded-[4px] ${
                            selectedDate === date
                              ? "bg-primary-50 text-white"
                              : isToday
                              ? "bg-blue-900 text-white"
                              : "bg-gray-800 hover:bg-gray-700"
                          } ${
                            dayOfWeek === 0 || dayOfWeek === 6
                              ? "text-blue-300"
                              : ""
                          }`}
                          onClick={() => setSelectedDate(date)}
                          style={{
                            gridColumnStart:
                              date === 1 ? dayOfWeek + 1 : undefined,
                          }}
                        >
                          {date}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className={`w-full mt-6 py-3  rounded-lg flex items-center justify-center gap-2 ${
                      selectedDate
                        ? "bg-primary-50 hover:bg-blue-700 inner-shadow"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                    onClick={() => selectedDate && setStep(2)}
                    disabled={!selectedDate}
                  >
                    Select Date
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="text-base 2xl:text-lg font-semibold mb-4 flex items-center gap-2">
                    Available times on {selectedMonth}/{selectedDate}/
                    {selectedYear}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                    {times.map((time) => (
                      <button
                        key={time}
                        className={`p-3 rounded-[4px] flex items-center justify-center ${
                          selectedTime === time
                            ? "bg-primary-50 text-white"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      className="bg-gray-700 hover:bg-gray-600 flex-1 py-3 rounded-lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg flex font-semibold items-center justify-center gap-2 ${
                        selectedTime
                          ? "bg-primary-50 hover:bg-blue-700 inner-shadow"
                          : "bg-gray-700 cursor-not-allowed"
                      }`}
                      onClick={() => selectedTime && setStep(3)}
                      disabled={!selectedTime}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-md font-semibold mb-4 flex items-center gap-4">
                    <Image
                      src="/card.svg"
                      alt="calendar"
                      width={25}
                      height={25}
                    />
                    Payment Details
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm 2xl:text-base mb-2 text-gray-400">
                      Your meeting is scheduled for:
                    </p>
                    <p className="font-semibold text-lg">
                      {selectedMonth}/{selectedDate}/{selectedYear} at{" "}
                      {selectedTime}
                    </p>
                  </div>

                  <div className="p-4  rounded-lg bg-gray-800 mb-4">
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-sm 2xl:text-base mb-2 font-semibold">
                        Routing Number: <br />
                        <span className="text-primary-500 font-normal">
                          00000000
                        </span>
                      </p>
                      <p className="text-sm 2xl:text-base mb-2 font-semibold">
                        Account Number: <br />
                        <span className="text-primary-500 font-normal">
                          1111222233334444
                        </span>
                      </p>
                    </div>
                    <p className="text-sm mt-6 text-center text-gray-400">
                      Please wire the payment to the above account and routing
                      number
                    </p>
                  </div>

                  {/* <div className="flex gap-3">
                    <button
                      className="bg-gray-700 hover:bg-gray-600 flex-1 py-2 rounded-lg"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg font-semibold inner-shadow bg-primary-50 hover:bg-blue-700 flex items-center justify-center gap-2 `}
                      disabled={!selectedTime}
                    >
                      Schedule Meeting
                    </button>
                  </div> */}
                  <ScheduleMeet />
                </>
              )}
            </div>
          </div>
          {/* <div className="p-3.5 2xl:p-5 w-full">
            <ScheduleMeet />
          </div> */}
        </div>
      </div>
      <h2 className="text-xl 2xl:text-2xl font-bold">You'll also like </h2>
      <div className=" w-full py-8 flex items-center flex-nowrap gap-4  overflow-x-auto max-w-full ">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className=" bg-[#18181B] rounded-[12px]">
            <Link href={"/ad-campaign/1"}>
              <div className="relative min-w-[320px] 2xl:min-w-[380px]  h-[200px] 2xl:h-[220px] bg-[#101927] rounded-[12px] overflow-hidden flex items-center justify-center">
                {/* Image */}

                <Image
                  key={index}
                  src="/game3.png"
                  alt="fortnite"
                  width={440}
                  height={420}
                  className="cursor-pointer object-cover w-full h-full"
                />

                {/* Dark Gradient Overlay for Better Text Visibility */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                <p className="text-xs 2xl:text-sm font-semibold text-white bg-[#2E4EB5] px-4 py-2.5 rounded-md absolute left-5 top-2.5">
                  CASUAL
                </p>
                {/* Text */}
                <p className="text-sm 2xl:text-base font-semibold text-white absolute left-5 bottom-5">
                  Monthly Impressions: 1.5B - 25B+
                </p>
              </div>
            </Link>

            <div className=" w-full p-4 space-y-4 py-5">
              <p className="flex items-center gap-2 font-semibold text-white text-sm 2xl:text-base ">
                <Image src="/graph.svg" width={30} height={30} alt="hehe" />
                Unique Monthly Players: 10M - 25M
              </p>
              <p className="flex items-center gap-2 font-semibold text-white text-sm 2xl:text-base ">
                <Image src="/demo.svg" width={30} height={30} alt="hehe" />
                Demo: 12-18 y/o
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

import { motion, AnimatePresence } from "framer-motion";

const SlotCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Example data - replace with your actual selected slots
  const slots = [
    {
      id: 1,
      image: "/game4.svg",
      title: "Crazy Red Vs Blue",
      location: "Central-Arena",
      score: "97%",
    },
    {
      id: 2,
      image: "/game3.png",
      title: "Epic Battle Royale",
      location: "North-Stadium",
      score: "92%",
    },
    {
      id: 3,
      image: "/game2.png",
      title: "Space Invaders",
      location: "Galactic-Zone",
      score: "88%",
    },
  ];

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === slots.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? slots.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction: string) => {
      return {
        x: direction === "right" ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => {
      return {
        x: direction === "right" ? -1000 : 1000,
        opacity: 0,
      };
    },
  };

  return (
    <div className="bg-[#0B111B] flex-1 h-full border border-[#FFFFFF33] rounded-[12px] flex flex-col">
      <div className="px-6 py-5 flex-1">
        <p className="2xl:text-2xl mb-3 sm:mb-[31px] text-xl font-semibold text-white">
          Individual Ad Breakdown
        </p>

        {/* Carousel Container */}
        <div className="relative w-full h-[24rem] overflow-hidden">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <div className="relative w-full h-full bg-[#101927] rounded-[12px] overflow-hidden">
                {/* Image */}
                <Image
                  src={slots[currentIndex].image}
                  alt={slots[currentIndex].title}
                  width={420}
                  height={420}
                  className="w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>

                {/* Slot Info */}
                <p className="text-xs uppercase 2xl:text-sm text-white absolute left-5 bottom-10">
                  {slots[currentIndex].title}
                </p>
                <div className="w-[85%] flex items-center justify-between absolute left-5 bottom-3">
                  <p className="2xl:text-lg font-semibold text-white">
                    {slots[currentIndex].location}
                  </p>
                  <p className="2xl:text-xl text-lg font-semibold text-[#42E34A]">
                    {slots[currentIndex].score}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition"
            aria-label="Previous slot"
          >
            <FaChevronLeft className="text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition"
            aria-label="Next slot"
          >
            <FaChevronRight className="text-white" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slots.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? "right" : "left");
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Projected Results (unchanged) */}
      <div className=" w-full bg-[#141C2A] border-t border-[#464646] px-6 py-8 2xl:py-8 h-full">
        <p className="text-xl font-semibold mb-2 2xl:mb-4 2xl:text-2xl text-white">
          Projected Results:
        </p>
        <div className="flex items-center border-b border-[#373A51] pb-2  py-0.5 2xl:py-2   justify-between">
          <p className="text-xs 2xl:text-base capitalize  text-primary-500">
            Duration:
          </p>
          <p className="  text-white">1 Month </p>
        </div>
        <div className="flex items-center border-b border-[#373A51] pb-2  py-0.5 2xl:py-2   justify-between">
          <p className="text-xs 2xl:text-base capitalize  text-primary-500">
            Total Price:
          </p>
          <p className="  text-white">$7200</p>
        </div>
        <div className="flex items-center border-b border-[#373A51] pb-2  py-0.5 2xl:py-2   justify-between">
          <p className="text-xs 2xl:text-base capitalize  text-primary-500">
            Expected Impressions /mo:
          </p>
          <p className=" font-semibold text-lg 2xl:text-xl text-[#42E34A]">
            4.6B - 5.9B
          </p>
        </div>
        <div className="flex items-center border-b border-[#373A51] pb-2  py-0.5 2xl:py-2   justify-between">
          <p className="text-xs 2xl:text-base capitalize  text-primary-500">
            AI Expected Performance
          </p>
          <p className=" font-semibold  text-lg 2xl:text-xl text-[#42E34A]">
            89%
          </p>
        </div>
        <div className=" justify-center mt-8 flex gap-2">
          {slots.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? "right" : "left");
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
