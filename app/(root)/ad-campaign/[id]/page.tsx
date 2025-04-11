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
import { motion } from "framer-motion";
import ArenaModel from "@/components/shared/3D/ArenaModel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";

const Page = () => {
  const [step, setStep] = React.useState(1);
  const [openCart, setOpenCart] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<number | undefined>(
    undefined
  );
  const [showSlots, setShowSlots] = React.useState(true);
  const [showMedia, setShowMedia] = React.useState(true);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [currentImageSrc, setCurrentImageSrc] = React.useState<string | null>(
    null
  );
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const meshRef = React.useRef<THREE.Mesh | null>(null);
  const [canvasFocusable, setCanvasFocusable] = React.useState(true);
  const [bannerMesh, setBannerMesh] = React.useState<THREE.Mesh | null>(null);

  // Function to disable canvas focus when interacting with UI
  const disableCanvasFocus = React.useCallback(() => {
    setCanvasFocusable(false);
  }, []);

  // Function to re-enable canvas focus
  const enableCanvasFocus = React.useCallback(() => {
    setCanvasFocusable(true);
  }, []);

  // Modified version for mouse events
  const disableCanvasFocusEvent = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvasFocusable(false);
  }, []);

  // Function to trigger file input
  const triggerFileInput = (mesh: THREE.Mesh) => {
    if (!fileInputRef.current) {
      fileInputRef.current = document.createElement("input");
      fileInputRef.current.type = "file";
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.style.display = "none";
      document.body.appendChild(fileInputRef.current);
    }

    fileInputRef.current.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageSrc = event.target?.result as string;
          setCurrentImageSrc(imageSrc);

          if (mesh) {
            const texture = new THREE.TextureLoader().load(imageSrc, () => {
              console.log("✅ Image Applied Successfully!");
              // Apply texture to mesh
              if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.map = texture;
                mesh.material.needsUpdate = true;
              } else {
                const material = new THREE.MeshStandardMaterial({
                  map: texture,
                  side: THREE.DoubleSide,
                });
                mesh.material = material;
              }
              setBannerMesh(mesh);
            });
            texture.flipY = false;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    fileInputRef.current.click();
  };

  return (
    <div className="mt-[90px] relative flex flex-col gap-5 z-20 justify-end w-full">
      {/* Select ad slot panel */}
      <div
        className="absolute left-10 z-50 top-6 bg-[#0B111B] border border-[#FFFFFF33] rounded-[12px] overflow-hidden transition-all duration-300"
        style={{
          width: "fit-content",
          maxHeight: showSlots ? "80vh" : "auto", // Expands to 90% of viewport height when open
        }}
        onMouseEnter={disableCanvasFocusEvent}
        onMouseLeave={enableCanvasFocus}
      >
        <div className="xl:w-[400px] p-3.5 xl:px-5 2xl:px-6 flex flex-col items-start ">
          {/* Header Section - Always Visible */}
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="2xl:text-xl text-lg font-semibold text-white">
              Select ad slot on the map:
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSlots(!showSlots);
              }}
            >
              <Image
                src="/toggle.svg"
                width={20}
                height={20}
                alt="info"
                className="2xl:w-5 2xl:h-5"
                onClick={() => {
                  setSelectedSlot(undefined);
                }}
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
              {/* Map through all available billboards */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSlot(index + 1);
                  }}
                  className={`bg-[#141C2A] w-full p-4 py-6 2xl:p-6 text-white cursor-pointer rounded-[12px] ${
                    selectedSlot === index + 1 &&
                    "border-primary-50/70 border-2"
                  }`}
                >
                  <p className="text-lg 2xl:text-xl font-semibold mb-1">
                    Billboard {index + 1}
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

      {/* About Your Media panel */}
      <div
        className="absolute right-10 z-50 top-6 bg-[#0B111B] border border-[#FFFFFF33] rounded-[12px] overflow-hidden transition-all duration-300"
        style={{
          width: "fit-content",
          maxHeight: showMedia ? "80vh" : "auto",
        }}
        onMouseEnter={disableCanvasFocusEvent}
        onMouseLeave={enableCanvasFocus}
      >
        <div className="xl:w-[400px] p-3.5 xl:px-5 2xl:px-6 flex flex-col items-start">
          <div className="flex w-full items-center gap-4 justify-start">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMedia(!showMedia);
              }}
            >
              <Image
                src="/toggle.svg"
                width={20}
                height={20}
                alt="info"
                className="2xl:w-5 2xl:h-5"
              />
            </button>
            <p className="2xl:text-xl text-lg font-semibold text-white">
              About Your Media
            </p>
          </div>

          <motion.div
            className="w-full overflow-hidden"
            initial={{ height: 0, marginTop: 0, paddingBottom: 0 }}
            animate={{
              height: showMedia ? "auto" : 0,
              marginTop: showMedia ? 20 : 0,
              paddingBottom: showMedia ? 20 : 0,
              maxHeight: showMedia ? "calc(80vh - 80px)" : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="overflow-y-auto pr-2"
              style={{ maxHeight: "calc(80vh - 100px)" }}
            >
              <div className="flex items-center mb-3 border-y py-3 border-primary-500 justify-between">
                <p className="text-sm 2xl:text-base text-white font-semibold">
                  Photo Editor
                </p>
                <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="bg-primary-50 text-xs flex items-center inner-shadow gap-2 rounded-[6px] hover:bg-primary-50/70 px-6 font-semibold 2xl:text-base text-white py-1"
                      onClick={() => setEditorOpen(true)}
                    >
                      Edit
                    </button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {/* Change Media Section */}
              <div className="flex items-center mb-3 border-b pb-3 border-primary-500 justify-between">
                <p className="text-sm 2xl:text-base text-white font-semibold">
                  Change Media
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-primary-50 text-xs flex items-center inner-shadow gap-2 rounded-[6px] hover:bg-primary-50/70 px-6 font-semibold 2xl:text-base text-white py-1">
                      View
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#08080B] border-none md:min-w-[900px] p-0">
                    <h2 className="text-lg font-bold 2xl:text-xl text-white pt-5 pl-5">
                      Change Media
                    </h2>
                    <div className="flex h-full w-full">
                      {/* Left side - Current Uploaded Image */}
                      <div className="w-1/2 border-r border-[#ffffff13] p-6 flex flex-col">
                        <div className="flex-1 bg-[#141C2A] rounded-lg flex items-center justify-center">
                          {currentImageSrc ? (
                            <img
                              src={currentImageSrc}
                              alt="Current Ad"
                              className="max-h-[300px] max-w-full object-contain"
                            />
                          ) : bannerMesh?.material ? (
                            (() => {
                              // Type guard to safely access material properties
                              const material =
                                bannerMesh.material as THREE.MeshStandardMaterial;
                              return material.map?.image?.src ? (
                                <img
                                  src={material.map.image.src}
                                  alt="Current Ad"
                                  className="max-h-[300px] max-w-full object-contain"
                                />
                              ) : (
                                <p className="text-primary-500">
                                  No texture applied
                                </p>
                              );
                            })()
                          ) : (
                            <p className="text-primary-500">
                              No image uploaded
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right side - Media Library */}
                      <div className="w-1/2 p-6">
                        <h3 className="text-white text-lg font-semibold mb-4">
                          Media Library
                        </h3>

                        {/* Tabs */}
                        <div className="flex border-b px-1 py-1 rounded-sm bg-[#27262B] border-[#FFFFFF33] mb-4">
                          {["All", "Images", "3D Models", "Videos"].map(
                            (tab) => (
                              <button
                                key={tab}
                                className={`px-6 rounded-sm py-1.5 flex-grow text-sm font-medium ${
                                  tab === "Images"
                                    ? "bg-[#08080B] text-white"
                                    : "text-primary-500 hover:text-white"
                                }`}
                              >
                                {tab}
                              </button>
                            )
                          )}
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            meshRef.current &&
                              triggerFileInput(meshRef.current);
                          }}
                          className="bg-primary-50 mt-2 inner-shadow flex items-center gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold text-xs xl:text-sm text-white py-2.5 2xl:py-3 rounded-md"
                        >
                          Upload New Media
                          <Image
                            src="/share.svg"
                            width={25}
                            height={25}
                            alt="upload"
                            className="2xl:w-6 2xl:h-6"
                          />
                        </Button>
                        <div className="grid grid-cols-3 mt-4 gap-1.5 overflow-y-auto">
                          {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                              key={item}
                              className="bg-[#27262B] rounded-md aspect-square flex items-center justify-center cursor-pointer hover:border hover:border-primary-50"
                            >
                              <span className="text-primary-500 text-sm">
                                Media {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* AI Summary Section */}
              <div className="w-full flex items-start gap-2 justify-evenly flex-col">
                <div className="px-6 py-5 my-2 rounded-xl border w-full border-[#4BEAA073] bg-[#4BEAA01A]">
                  <div className="flex items-center justify-between border-b mb-4 border-primary-500 pb-4">
                    <h2 className="text-sm 2xl:text-lg font-semibold">
                      AI Summary
                    </h2>
                    <Image src="/logo.svg" alt="ai" width={60} height={60} />
                  </div>
                  <p className="text-sm 2xl:text-base py-1">
                    This ad creative looks perfect!
                  </p>
                  <div className="flex items-end gap-2 mt-4 justify-between">
                    <p className="text-primary-500 text-xs 2xl:text-sm">
                      FOV Score:
                    </p>
                    <p className="text-[#4BEAA0] font-semibold text-3xl 2xl:text-4xl">
                      93%
                    </p>
                  </div>
                </div>

                <Link href="/campaign-builder" className="w-full">
                  <Button className="bg-primary-50 mt-4 text-xs flex items-center inner-shadow gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold 2xl:text-base text-white py-2.5 2xl:py-3">
                    Campaign Builder
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center w-full justify-center h-[87svh] overflow-hidden">
        <ArenaModel
          selectedSlotId={selectedSlot}
          canvasFocusable={canvasFocusable}
          disableCanvasFocus={disableCanvasFocus}
          enableCanvasFocus={enableCanvasFocus}
        />
      </div>
      <div
        className="wrapper flex flex-col items-center gap-4 pt-8"
        onMouseEnter={disableCanvasFocusEvent}
        onMouseLeave={enableCanvasFocus}
      >
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl 2xl:text-2xl font-semibold text-white">
            Pair This With:{" "}
            <span className="text-[#2068B2] font-light text-base px-2 underline">
              Upload more material to see examples of other ad slots{" "}
            </span>
          </h1>
        </div>
        <div className="w-full py-5 flex items-center mb-8 flex-nowrap gap-5 overflow-x-auto max-w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-w-[360px] sm:min-w-[380px]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {" "}
                    <Link
                      href={`/ad-campaign/${index}`}
                      passHref
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative w-[380px] h-[210px] bg-[#101927] rounded-[12px] overflow-hidden flex items-center justify-center">
                        {/* Image */}
                        <Image
                          key={index}
                          src="/game3.png"
                          alt="fortnite"
                          width={420}
                          height={420}
                          className="cursor-pointer object-cover w-full h-full"
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
                      <p className="text-sm capitalize text-primary-500">
                        plays
                      </p>
                      <p className="font-semibold text-white">
                        40M - 55M / month
                      </p>
                    </div>
                    <div className="flex items-center py-1.5 justify-between">
                      <p className="text-sm capitalize text-primary-500">
                        Impressions / placement:
                      </p>
                      <p className="font-semibold text-white">1.5B - 2.5B/m</p>
                    </div>
                    <div className="flex items-center py-1.5 justify-between">
                      <p className="text-sm capitalize text-primary-500">
                        Assumed Demographic:
                      </p>
                      <p className="font-semibold text-white">12-18 y/o</p>
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
