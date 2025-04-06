"use client";
import LineChartComponent from "@/components/shared/lineChart";
import BarChart from "@/components/shared/barChart";
import Image from "next/image";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Page = () => {
  const [tab, setTab] = React.useState("30 days");
  return (
    <div className=" w-full px-3 py-8 sm:p-8 z-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="text-center sm:text-start mb-4 md:mb-0">
          <p className="text-white text-lg 2xl:text-2xl font-light">
            Welcome back, Olivia
          </p>
        </div>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">
        <div className=" w-full">
          <div className="rounded-xl bg-[#040911] border border-[#FFFFFF33]  shadow mb-8">
            <div className="flex justify-between  p-6 border-b border-[#FFFFFF33]  text-white">
              <div className="space-y-2.5">
                <p className="2xl:text-base text-sm  ">Total Balance</p>

                <h2 className="text-2xl 2xl:text-3xl font-semibold">
                  $107,843.82
                </h2>
              </div>
              <button className="bg-black border border-[#FFFFFF33] hover:bg-gray-900 text-xs 2xl:text-sm inline-flex items-center gap-2 text-white px-5 py-3 h-fit rounded-[12px]">
                View Report
              </button>
            </div>
            <div className=" w-full h-96 py-6 ">
              <LineChartComponent />
            </div>
          </div>

          {/* Campaign Details */}
          <div className="rounded-xl bg-[#040911] border border-[#FFFFFF33]  shadow mb-8">
            <div className="flex justify-between items-center p-6 border-b border-[#FFFFFF33]  text-white">
              <h2 className="2xl:text-lg  ">Campaign Details:</h2>
              <div className="hidden md:flex z-20 items-center  border border-[#FFFFFF33] rounded-[8px] ">
                <button className="bg-black border border-[#FFFFFF33] hover:bg-gray-900 text-xs 2xl:text-sm inline-flex items-center gap-2 text-white px-5 py-3 rounded-[12px]">
                  <Image
                    src="/export.svg"
                    alt="filter"
                    width={20}
                    height={20}
                  />
                  Download
                </button>
                <button className="bg-black border border-[#FFFFFF33] hover:bg-gray-900 text-xs 2xl:text-sm inline-flex items-center gap-2 text-white px-5 py-3 rounded-[12px]">
                  View Report
                </button>
              </div>{" "}
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-6 border-b border-[#FFFFFF33]  text-white">
              <div className="flex z-20 items-center   border border-[#FFFFFF33] rounded-[8px] ">
                <button
                  onClick={() => setTab("30 days")}
                  className={`

          ${
            tab === "30 days"
              ? "bg-[#FFFFFF33] text-white  border border-[#FFFFFF33] "
              : "bg-transparent text-gray-300"
          } px-6 py-2.5 font-semibold text-xs 2x:text-sm rounded-[8px]`}
                >
                  View All
                </button>
                <button
                  onClick={() => setTab("7 days")}
                  className={`
          ${
            tab === "7 days"
              ? "bg-[#FFFFFF33] text-white  border border-[#FFFFFF33] "
              : "bg-transparent text-gray-300"
          } px-3 2xl:px-6 py-2.5  font-semibold text-xs 2x:text-sm rounded-[8px]`}
                >
                  Monitored
                </button>
                <button
                  onClick={() => setTab("1 day")}
                  className={`
          ${
            tab === "1 day"
              ? "bg-[#FFFFFF33] text-white  border border-[#FFFFFF33] "
              : "bg-transparent text-gray-300"
          } px-3 2xl:px-6 py-2.5  font-semibold text-xs 2x:text-sm rounded-[8px]`}
                >
                  Unmonitored
                </button>
              </div>
              <div className="flex  w-full items-center gap-2 sm:w-fit border border-[#FFFFFF33] p-2 rounded-xl">
                <Image
                  src="/search.svg"
                  alt="404"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent text-xs 2xl:text-base font-thin outline-none text-slate-300"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row  items-center gap-6 px-3 ">
              <Table>
                <TableHeader className="border-b border-[#FFFFFF33]">
                  <TableRow className="border-b border-[#FFFFFF33]">
                    <TableHead className="">Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="">Category</TableHead>
                    <TableHead className="">Account</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <TableRow
                      key={item}
                      className="border-b border-[#FFFFFF33]"
                    >
                      <TableCell className="">#123456</TableCell>
                      <TableCell>$1,000</TableCell>
                      <TableCell>12/12/2021</TableCell>
                      <TableCell className="">Food</TableCell>
                      <TableCell className="">Savings</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
