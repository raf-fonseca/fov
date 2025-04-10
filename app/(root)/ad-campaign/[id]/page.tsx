"use client";
import Image from "next/image";
import React from "react";
import * as THREE from "three";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GlbModel from "@/components/shared/GlbModel";
import { motion } from "framer-motion";
import ArenaModel from "@/components/shared/ArenaModel";
const Page = () => {
  const [step, setStep] = React.useState(1);
  const [openCart, setOpenCart] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState(2);
  const [showSlots, setShowSlots] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const meshRef = React.useRef<THREE.Mesh | null>(null);

  // const handleImageUpload = (mesh: THREE.Mesh) => {
  //   meshRef.current = mesh; // Store the selected mesh
  //   if (!fileInputRef.current) {
  //     fileInputRef.current = document.createElement("input");
  //     fileInputRef.current.type = "file";
  //     fileInputRef.current.accept = "image/*";
  //     fileInputRef.current.style.display = "none";
  //     document.body.appendChild(fileInputRef.current);
  //   }

  //   fileInputRef.current.onchange = (e: Event) => {
  //     const target = e.target as HTMLInputElement;
  //     const file = target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         if (meshRef.current) {
  //           const texture = new THREE.TextureLoader().load(
  //             event.target?.result as string,
  //             () => {
  //               console.log("✅ Image Applied Successfully!");
  //               meshRef.current!.material.map = texture;
  //               meshRef.current!.material.needsUpdate = true;
  //             }
  //           );
  //           texture.flipY = false;
  //           texture.wrapS = THREE.ClampToEdgeWrapping;
  //           texture.wrapT = THREE.ClampToEdgeWrapping;
  //           texture.minFilter = THREE.LinearFilter;
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   fileInputRef.current.click(); // Trigger file picker
  // };
  return (
    <div className="mt-[90px]  relative  flex flex-col gap-5 z-20 justify-end  w-full">
      <div
        className="absolute left-10 z-50 top-6 bg-[#0B111B] border border-[#FFFFFF33] rounded-[12px] overflow-hidden transition-all duration-300"
        style={{
          width: "fit-content",
          maxHeight: showSlots ? "80vh" : "auto", // Expands to 90% of viewport height when open
        }}
      >
        <div className="xl:w-[400px] p-3.5 xl:px-5 2xl:px-6 flex flex-col items-start ">
          {/* Header Section - Always Visible */}
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="2xl:text-xl text-lg font-semibold text-white">
              Select ad slot on the map:
            </p>
            <button onClick={() => setShowSlots(!showSlots)}>
              <Image
                src="/toggle.svg"
                width={20}
                height={20}
                alt="info"
                className="2xl:w-5 2xl:h-5"
              />
            </button>
          </div>

          {/* Expandable Content */}
          <motion.div
            className="w-full overflow-hidden "
            initial={{ height: 0, paddingBottom: 0, marginTop: 0 }}
            animate={{
              height: showSlots ? "90vh" : 0, // Expand height
              paddingBottom: showSlots ? 20 : 0,
              marginTop: showSlots ? 20 : 0,
            }}
          >
            <div
              className="max-h-[70vh] overflow-y-auto pr-2 space-y-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSlot(index + 1)}
                  className={`bg-[#141C2A] w-full p-4 py-6 2xl:p-6 text-white cursor-pointer rounded-[12px] ${
                    selectedSlot === index + 1 &&
                    "border-primary-50/70 border-2"
                  }`}
                >
                  <p className="text-lg 2xl:text-xl font-semibold mb-1">
                    Vault Wall {index + 1}
                  </p>
                  <div className="flex items-center border-b border-[#FFFFFF]/20 py-3 mb-4 justify-between">
                    <p className="text-xs 2xl:text-sm capitalize text-primary-500">
                      Monthly Impressions:
                    </p>
                    <p className="font-semibold text-xs 2xl:text-base text-[#42E34A]">
                      1.5B - 2.5B/m
                    </p>
                  </div>
                  <div className="flex items-start border-b border-[#FFFFFF]/20 py-3 mb-4 justify-between">
                    <p className="text-xs 2xl:text-sm capitalize text-primary-500">
                      Distance Split:
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs 2xl:text-sm capitalize text-primary-500">
                          Close:
                        </p>
                        <p className="2xl:text-lg font-semibold text-white">
                          8%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs 2xl:text-sm capitalize text-primary-500">
                          Medium:
                        </p>
                        <p className="2xl:text-lg font-semibold text-[#42E34A]">
                          40%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs 2xl:text-sm capitalize text-primary-500">
                          Far:
                        </p>
                        <p className="2xl:text-lg font-semibold text-[#42E34A]">
                          8%
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold pt-1 text-white">
                    Supported Ads: 2D Still, 2D Animated
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="   flex items-center w-full justify-center h-[87svh]  overflow-hidden">
        {/* <GlbModel id={selectedSlot} /> */}
        <ArenaModel />
      </div>
      <div className="  wrapper flex flex-col items-center gap-4 pt-8  ">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl 2xl:text-2xl font-semibold text-white">
            Pair This With:{" "}
            <span className="text-[#2068B2] font-light text-base px-2 underline">
              Upload more material to see examples of other ad slots{" "}
            </span>
          </h1>
        </div>
        <div className=" w-full py-5 flex items-center mb-8 flex-nowrap gap-5 overflow-x-auto max-w-full ">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className=" min-w-[360px] sm:min-w-[380px] ">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {" "}
                    <Link href={`/ad-campaign/${index}`} passHref>
                      <div className="relative w-[380px] h-[210px] bg-[#101927] rounded-[12px] overflow-hidden flex items-center justify-center">
                        {/* Image */}
                        <Image
                          key={index}
                          src="/game3.png"
                          alt="fortnite"
                          width={420}
                          height={420}
                          className=" cursor-pointer object-cover w-full h-full"
                        />

                        {/* Dark Gradient Overlay for Better Text Visibility */}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
                        <p className="text-xs 2xl:text-sm font-semibold text-white bg-[#2E4EB5] px-4 py-2.5 rounded-md absolute left-5 top-2.5">
                          CASUAL
                        </p>
                        {/* Text */}
                        <p className="text-xs 2xl:text-sm font-semibold text-white absolute left-5 bottom-5">
                          Monthly Impressions: 1.5B - 25B+
                        </p>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#141C2A] w-96 p-4 text-white border-none rounded-[12px]">
                    <p className="text-lg font-semibold mb-3">
                      Crazy Red Vs Blue
                    </p>
                    <p className="text-primary-500">Genre: Combat</p>
                    <p className="text-primary-500 border-b border-[#FFFFFF]/20 pb-4 mb-4">
                      Top 5 Highest-Traffic Game{" "}
                    </p>
                    <div className="flex items-center py-1.5 justify-between">
                      <p className="text-sm capitalize  text-primary-500">
                        plays
                      </p>
                      <p className=" font-semibold text-white">
                        40M - 55M / month
                      </p>
                    </div>
                    <div className="flex items-center py-1.5 justify-between">
                      <p className="text-sm capitalize  text-primary-500">
                        Impressions / placement:
                      </p>
                      <p className=" font-semibold text-white">1.5B - 2.5B/m</p>
                    </div>
                    <div className="flex items-center py-1.5 justify-between">
                      <p className="text-sm capitalize  text-primary-500">
                        Assumed Demographic:
                      </p>
                      <p className=" font-semibold text-white">12-18 y/o</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
