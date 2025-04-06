"use client";
import Image from "next/image";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScheduleMeet from "@/components/shared/ScheduleMeet";

const Page = () => {
  return (
    <div className="mt-24 py-5  z-50 wrapper w-full">
      <div className="flex flex-col  lg:flex-row h-full items-start justify-between gap-8 sm:gap-4 xl:gap-6 w-full">
        <div className="bg-[#0B111B]  flex-1 h-full  border border-[#FFFFFF33] rounded-[12px] flex items-start gap-4 justify-evenly  flex-col ">
          <div className="px-6 py-5 2xl:py-8">
            <p className="2xl:text-xl mb-3 sm:mb-[31px] text-lg font-semibold text-white">
              Your Ads Preview
            </p>
            <div className="grid grid-cols-1 h-[21rem] overflow-y-auto sm:grid-cols-2 gap-4 xl:gap-8 ">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="relative  w-full h-[180px] bg-[#101927] rounded-[12px] overflow-hidden flex items-center justify-center">
                  {/* Image */}
                  <Image
                    src="/game4.svg"
                    alt="fortnite"
                    width={420}
                    height={420}
                    className="mx-2 cursor-pointer object-cover w-full h-full"
                  />

                  {/* Dark Gradient Overlay for Better Text Visibility */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                  <p className="text-xs uppercase 2xl:text-sm  text-white absolute left-5 bottom-10">
                    Crazy Red Vs Blue
                  </p>
                  <div className=" w-[85%] flex items-center justify-between absolute left-5 bottom-3">
                    <p className=" 2xl:text-lg font-semibold text-white ">
                      Central-Arena
                    </p>
                    <p className=" 2xl:text-xl text-lg font-semibold text-[#42E34A] ">
                      97%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className=" w-full bg-[#141C2A]  px-6 py-8 2xl:py-8">
            <p className="text-sm font-semibold mb-2 2xl:mb-4 2xl:text-base text-white">
              Projected Results:
            </p>
            <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
              <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                Duration:
              </p>
              <p className="  text-white">1 Month </p>
            </div>
            <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
              <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                Total Price:
              </p>
              <p className="  text-white">$7200</p>
            </div>
            <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
              <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                Expected Impressions /mo:
              </p>
              <p className=" font-semibold text-lg 2xl:text-xl text-[#42E34A]">
                4.6B - 5.9B
              </p>
            </div>
            <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
              <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                AI Expected Performance
              </p>
              <p className=" font-semibold  text-lg 2xl:text-xl text-[#42E34A]">
                89%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0B111B]  flex-1 w-full h-full  border border-[#FFFFFF33] rounded-[12px] flex items-start gap-4 justify-between   flex-col ">
          <div className="p-5 2xl:px-5 2xl:py-8 w-full  ">
            <div className="flex items-center justify-between mb-5  sm:mb-[31px]  gap-4">
              <p className="2xl:text-xl text-lg font-semibold text-white">
                Schedule a meeting to finalize booking
              </p>
            </div>

            <div className="space-y-3 w-full overflow-y-auto ">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#141C2A] w-full p-2.5 xl:px-4 text-white border-none rounded-[12px]"
                >
                  <div className="flex items-center py-1.5 2xl:py-2.5   justify-between">
                    <p className="text-lg 2xl:text-xl font-semibold mb-1  ">
                      Vault Wall 2
                    </p>
                    <p className="2xl:text-lg font-semibold mb-1  ">$1.5 CPM</p>
                  </div>
                  <div className="flex items-center   py-1.5 2xl:py-2.5   justify-between">
                    <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                      Expected Impressions /mo:
                    </p>
                    <p className=" font-semibold text-[#42E34A]">
                      1.5B - 2.5B/m
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3.5 2xl:p-5 w-full">
            <ScheduleMeet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
