"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import FadeInSection from "@/components/shared/FadeInAnimation";
import { LucideFilter } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
const steps = [
  {
    title: "Select a Game",
    description: "Choose from our library of popular Fortnite creative games.",
  },
  {
    title: "Choose Ad Location",
    description:
      "Pick premium spots with the highest visibilty and engagement.",
  },
  {
    title: "Upload & Launch ",
    description:
      "Upload your creative, Set your budget, and launch your campaign.",
  },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  return (
    <>
      <Navbar />
      <main className="">
        <FadeInSection>
          <section className="wrapper">
            <div className=" py-12 mx-auto   xl:py-20 2xl:py-24  flex flex-col md:flex-row items-center gap-6  md:gap-16 justify-between">
              <div className=" w-full space-y-6 2xl:space-y-8">
                <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-black text-white">
                  Advertise in{" "}
                  <span className="text-primary-50">Fortnite </span>
                </h1>
                <p className="text-gray-400 text-lg 2xl:text-2xl">
                  Place your branc in ront of millions of engageded Fortnite
                  players with our in-game advertising platform.
                </p>
                <div className="inline-flex gap-3 items-center">
                  <button className="bg-primary-50 hidden md:block px-4 xl:px-10 2xl:px-12 font-semibold text-sm 2xl:text-base text-white py-2.5 2xl:py-4 rounded-md">
                    Continue
                  </button>
                  <button className="bg-white hidden md:block px-4 xl:px-6 2xl:px-10 font-semibold text-sm 2xl:text-base  py-2.5 2xl:py-4 rounded-md">
                    View Demo
                  </button>
                </div>
              </div>
              <div className=" w-full ">
                <Image
                  src="/game2.png"
                  alt="hero"
                  width={720}
                  height={780}
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        </FadeInSection>
        <FadeInSection>
          <section className="bg-[#2C2C2C]/30 wrapper flex flex-col items-center gap-4 py-12 md:py-20 xl:py-28">
            <h1 className="text-3xl 2xl:text-5xl font-bold text-white">
              How It Works{" "}
            </h1>
            <p className="text-gray-400 2xl:text-lg">
              Three simple step to get your brand in the game
            </p>
            <div className="grid md:hidden pt-6 xl:pt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 2xl:gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className=" p-6 md:p-8 border-2 hover:border-primary-50 bg-[#2C2C2C]/10 md:py-8 space-y-3  border-stone-800 rounded-xl"
                >
                  <h1 className="text-primary-50 font-bold text-3xl md:text-5xl 2xl:text-5xl pb-2">
                    0{index + 1}
                  </h1>
                  <h1 className="text-xl 2xl:text-2xl font-bold text-white">
                    {step.title}
                  </h1>
                  <p className="text-gray-400 text-sm 2xl:text-lg">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className=" hidden w-full bg-[#101827] rounded-[10px] md:flex items-start justify-center  p-6 pb-10 pt-12 2xl:pt-16">
              <div className="flex flex-col gap-2 items-center">
                <div className="w-[30px] h-[30px] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/completed.svg"
                    alt="game"
                    width={30}
                    height={30}
                    className=""
                  />
                </div>
                <p className="text-primary-50 2xl:text-lg  font-semibold">
                  Step 1
                </p>
                <p className="text-lg 2xl:text-xl font-bold text-white text-center">
                  Find Your Perfect <br /> Ad
                </p>
              </div>
              <div className="w-[330px] 2xl:w-[470px] h-[2px] rounded-full mt-3.5 2xl:mt-4 -mx-8 2xl:-mx-10 bg-primary-50"></div>
              <div className="flex flex-col gap-2 items-center">
                <div className="w-[30px] h-[30px] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/in-progress.svg"
                    alt="game"
                    width={30}
                    height={30}
                    className=""
                  />
                </div>
                <p className="text-primary-50 2xl:text-lg  font-semibold">
                  Step 2
                </p>
                <p className="text-lg 2xl:text-xl font-bold text-white text-center">
                  Optimize Your <br /> Campaign
                </p>
              </div>
              <div className="w-[330px] 2xl:w-[470px] h-[2px] rounded-full mt-3.5 2xl:mt-4 -mx-8 2xl:-mx-10 bg-primary-50"></div>

              <div className="flex flex-col gap-2 items-center">
                <div className="w-[30px] h-[30px] overflow-hidden flex items-center justify-center">
                  <Image
                    src="/incomplete.svg"
                    alt="game"
                    width={15}
                    height={15}
                    className=" "
                  />
                </div>
                <p className="text-primary-50 2xl:text-lg  font-semibold">
                  Step 3
                </p>
                <p className="text-lg 2xl:text-xl font-bold text-white text-center">
                  Maximize Your <br /> Reach
                </p>
              </div>
            </div>
            <div className=" w-full hidden  rounded-[10px] md:flex items-center justify-center  gap-8 2xl:gap-16 p-3 2xl:p-6 ">
              <Image
                src="/p1.svg"
                alt="game"
                width={260}
                height={260}
                className="
                w-[260px] h-[210px] 2xl:w-[330px] 2xl:h-[260px]
                "
              />
              <Image
                src="/arrow.svg"
                alt="game"
                width={70}
                height={70}
                className=""
              />
              <Image
                src="/p2.svg"
                alt="game"
                width={260}
                height={260}
                className="
                w-[260px] h-[210px] 2xl:w-[330px] 2xl:h-[260px]
                "
              />
              <Image
                src="/arrow.svg"
                alt="game"
                width={70}
                height={70}
                className=""
              />
              <Image
                src="/p3.svg"
                alt="game"
                width={260}
                height={260}
                className="
                w-[260px] h-[210px] 2xl:w-[330px] 2xl:h-[260px]
                "
              />
            </div>
          </section>
        </FadeInSection>
        <FadeInSection>
          {" "}
          <section className=" wrapper flex flex-col items-center gap-4 py-12 md:py-20 xl:py-28">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl 2xl:text-4xl font-bold text-white">
                Select a Game to See More
              </h1>
              {/* <button className="bg-white hidden md:block px-4 2xl:px-10 font-semibold text-sm 2xl:text-base  py-3 2xl:py-4 rounded-md">
                Don't know what to choose?
              </button> */}
            </div>
            <div className=" w-full bg-[#101827] rounded-[10px] flex flex-col items-start justify-center  p-6 2xl:p-8 ">
              <h3 className="flex items-center gap-2 text-lg 2xl:text-xl font-semibold text-white">
                <LucideFilter className="text-primary-50" />
                Filters
              </h3>
              <div className=" flex flex-col w-full pb-4 md:flex-row items-center mt-6 gap-8">
                <div className=" w-full 2xl:w-[400px]">
                  <div className="flex items-center mb-3 justify-between">
                    <p className="text-white">Impressions</p>
                    <p className="text-primary-500">3.5B - 4.6B</p>
                  </div>
                  <Slider
                    className="bg-slate-900"
                    min={0}
                    max={100}
                    defaultValue={[10, 75]}
                  />
                </div>
                <div className=" w-full 2xl:w-[400px]">
                  <div className="flex items-center mb-3 justify-between">
                    <p className="text-white">Age</p>
                    <p className="text-primary-500">14 - 35+</p>
                  </div>
                  <Slider
                    className="bg-slate-900"
                    min={0}
                    max={30}
                    defaultValue={[10, 28]}
                  />
                </div>
              </div>
            </div>
            <div className=" w-full py-8 flex items-center flex-nowrap gap-4  overflow-x-auto max-w-full ">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  className=" bg-[#18181B] rounded-[12px]"
                  onClick={() => {
                    if (selectedGame) {
                      setSelectedGame(null);
                    } else {
                      setSelectedGame("fortnite");
                    }
                  }}
                >
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
                  <div className=" w-full p-4 space-y-4 py-5">
                    <p className="flex items-center gap-2 font-semibold text-white text-sm 2xl:text-base ">
                      <Image
                        src="/graph.svg"
                        width={30}
                        height={30}
                        alt="hehe"
                      />
                      Unique Monthly Players: 10M - 25M
                    </p>
                    <p className="flex items-center gap-2 font-semibold text-white text-sm 2xl:text-base ">
                      <Image
                        src="/demo.svg"
                        width={30}
                        height={30}
                        alt="hehe"
                      />
                      Demo: 12-18 y/o
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: selectedGame === "fortnite" ? 700 : 0,
                opacity: selectedGame === "fortnite" ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full mt-5 overflow-hidden"
            >
              <h1 className="text-2xl 2xl:text-4xl font-bold text-white">
                Fortnite Battle Royale
              </h1>
              <div className="w-full h-[692px] relative rounded-[12px] overflow-hidden mt-8">
                <Image
                  src="/video.svg"
                  alt="fortnite"
                  width={720}
                  height={780}
                  className="cursor-pointer object-cover w-full h-full"
                />
                <Link
                  href={"/ad-campaign"}
                  className="bg-primary-50 absolute bottom-20 text-white gap-2 font-semibold rounded-[8px] right-5 px-8 py-3.5 flex items-center"
                >
                  Continue <FaArrowRightLong className="text-lg" />
                </Link>
              </div>
            </motion.div>
          </section>
        </FadeInSection>
        <FadeInSection>
          {" "}
          <section className=" wrapper flex flex-col items-center gap-4 pb-12 md:pb-20 xl:pb-28 xl:px-32">
            <h1 className="text-3xl 2xl:text-5xl text-center font-bold text-white">
              Powered by <br className="sm:hidden" /> FOV-tracking SDK
            </h1>
            <p className="text-gray-400 2xl:text-lg text-center">
              Advanced technology for precise ad performance measurement
            </p>
            <div className="grid pt-6 xl:pt-10 grid-cols-1 sm:grid-cols-2 justify-items-center  ms:px-8 md:px-12 xl:px-20 2xl:px-24 gap-3 sm:gap-4 md:gap-6 2xl:gap-8">
              <div className=" p-6 md:p-8 bg-[#2C2C2C]/20 md:py-8 space-y-4 border-2 border-stone-800 hover:border-primary-50 rounded-xl">
                <div className="text-primary-50 flex items-center justify-center font-bold text-2xl w-14 h-14 p-3 rounded-xl bg-primary-50/20  ">
                  <IoEyeOutline />
                </div>
                <h1 className="text-xl 2xl:text-2xl pt-3 font-bold text-white">
                  Track Distance & Duration
                </h1>
                <p className="text-gray-400 text-sm 2xl:text-lg">
                  Precisely measure ad impressions with our advanced
                  FOV-tracking technology, capturing both viewing distance and
                  duration for accurate engagement metrics.{" "}
                </p>
              </div>
              <div className=" p-6 md:p-8 bg-[#2C2C2C]/20 md:py-8 space-y-4 border-2 border-stone-800 hover:border-primary-50 rounded-xl">
                <div className="text-primary-50 flex items-center justify-center font-bold text-2xl w-14 h-14 p-3 rounded-xl bg-primary-50/20  ">
                  <FaRegStar />
                </div>
                <h1 className="text-xl pt-3 2xl:text-2xl font-bold text-white">
                  Premium Placements
                </h1>
                <p className="text-gray-400 text-sm 2xl:text-lg">
                  Get guaranteed premium ad spots in high-traffic areas,
                  ensuring maximum visibility and engagement with your target
                  audience.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>
        <FadeInSection>
          {" "}
          <section className="bg-[#2C2C2C]/30 wrapper flex flex-col items-center gap-4 py-12 md:py-20 xl:py-28">
            <div className="flex flex-col lg:flex-row items-center w-full bg-gradient-to-r from-purple-950/30 via-slate-950 to-blue-950/50 justify-between py-12 gap-10 px-4 sm:p-16 xl:p-12 xl:py-20 rounded-xl border border-gray-900">
              <div className="max-w-md space-y-5 text-center lg:text-start">
                <h2 className="text-3xl 2xl:text-4xl font-bold text-white">
                  Ready to reach millions of Fortnite players?
                </h2>
                <p className="text-gray-400 2xl:text-lg">
                  Join hundreds of brands already advertising in the metaverse.
                  Get started today and see the results tomorrow.
                </p>
              </div>
              <div>
                <button className="bg-primary-50  px-8 2xl:px-10  text-sm 2xl:text-base  text-white py-3 2xl:py-4 rounded-md">
                  Start Your Campaign
                </button>
                <p className="text-gray-400 text-end mt-3">
                  Learn more about our pricing
                </p>
              </div>
            </div>
          </section>
          <footer className=" w-full py-10 border-t-2 border-gray-900 flex items-center justify-center">
            <p className="text-primary-500 text-sm 2xl:text-base">
              © 2025 Hidden Studios. All rights reserved.
            </p>
          </footer>
        </FadeInSection>
      </main>
    </>
  );
}
