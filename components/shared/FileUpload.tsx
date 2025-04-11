"use client";

import type React from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onClose: () => void;
  billboardId: number | null;
  onImageUploaded?: (billboardId: number, textureUrl: string) => void;
  disableCanvasFocus?: () => void;
  enableCanvasFocus?: () => void;
  billboardDimensions?: { width: number; height: number };
}

export default function FileUpload({
  onClose,
  billboardId,
  onImageUploaded,
  disableCanvasFocus,
  enableCanvasFocus,
  billboardDimensions = { width: 3, height: 2 }, // Default aspect ratio if not provided
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<"upload" | "adjust">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Image adjustment states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [initialTouchDistance, setInitialTouchDistance] = useState<
    number | null
  >(null);
  const [initialZoomLevel, setInitialZoomLevel] = useState<number>(1);

  // Calculate aspect ratio for the crop area based on billboard dimensions
  const billboardAspectRatio =
    billboardDimensions.width / billboardDimensions.height;

  // Disable canvas focus when the component mounts
  useEffect(() => {
    if (disableCanvasFocus) {
      disableCanvasFocus();
    }

    // Re-enable canvas focus when the component unmounts
    return () => {
      if (enableCanvasFocus) {
        enableCanvasFocus();
      }
    };
  }, [disableCanvasFocus, enableCanvasFocus]);

  // Original File Upload functionality
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure the file input ref exists and click it directly
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input reference is null");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure canvas focus is enabled before closing
    if (enableCanvasFocus) {
      enableCanvasFocus();
    }

    onClose();
  };

  const processFile = (file: File) => {
    if (!billboardId) return;

    setIsUploading(true);

    // Check if file is an image
    if (
      !file.type.match("image.*") &&
      !file.type.match("video.*") &&
      file.type !== "model/gltf+json" &&
      !file.name.endsWith(".glb")
    ) {
      setIsUploading(false);
      alert("Error: Unsupported file type");
      return;
    }

    // Create preview URL for the image
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    // Show success after upload simulation
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);

      // Move to adjust step after showing success animation
      setTimeout(() => {
        setIsSuccess(false);
        setCurrentStep("adjust");
        // Reset position and zoom when entering adjust step
        setPosition({ x: 0, y: 0 });
        setZoomLevel(1);
      }, 1500);
    }, 1000);
  };

  // Image adjustment handlers
  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (isDraggingImage) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch for dragging
      setIsDraggingImage(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      // Two touches for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setInitialTouchDistance(distance);
      setInitialZoomLevel(zoomLevel);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while adjusting

    if (e.touches.length === 1 && isDraggingImage) {
      // Handle dragging
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    } else if (e.touches.length === 2 && initialTouchDistance !== null) {
      // Handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scale = distance / initialTouchDistance;
      const newZoom = Math.max(0.5, Math.min(3, initialZoomLevel * scale));
      setZoomLevel(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDraggingImage(false);
    setInitialTouchDistance(null);
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const handleCancelAdjust = () => {
    setCurrentStep("upload");
    setPreviewUrl(null);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Add function to crop the image based on user adjustments
  const cropAndProcessImage = () => {
    if (
      !previewUrl ||
      !billboardId ||
      !containerRef.current ||
      !imageRef.current
    ) {
      console.error("Missing required references for cropping");
      return;
    }

    // Create a canvas to perform the cropping
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }

    try {
      // Get the dimensions of the container and the crop area
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate the crop area dimensions
      const cropArea = containerRef.current.querySelector(
        'div[style*="aspectRatio"]'
      );
      if (!cropArea) {
        console.error("Could not find crop area element");
        return;
      }
      const cropRect = cropArea.getBoundingClientRect();

      // Calculate the scale and position of the image relative to the container
      const img = new Image();

      img.onload = () => {
        try {
          // Set canvas size to match the actual billboard aspect ratio
          canvas.width = 1024; // Standard width
          canvas.height = Math.round(1024 / billboardAspectRatio);

          console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
          console.log("Billboard aspect ratio:", billboardAspectRatio);

          // Calculate visible image dimensions and position
          const imageScale = zoomLevel;
          const imageWidth = img.width * imageScale;
          const imageHeight = img.height * imageScale;

          console.log("Image dimensions:", img.width, "x", img.height);
          console.log("Image scale:", imageScale);
          console.log("Scaled image dimensions:", imageWidth, "x", imageHeight);

          // Calculate the image position relative to the crop area
          const imageCenterX = containerRect.width / 2 + position.x;
          const imageCenterY = containerRect.height / 2 + position.y;

          const cropCenterX =
            cropRect.left + cropRect.width / 2 - containerRect.left;
          const cropCenterY =
            cropRect.top + cropRect.height / 2 - containerRect.top;

          console.log("Container rect:", containerRect);
          console.log("Crop rect:", cropRect);
          console.log("Image position:", position);
          console.log("Image center:", imageCenterX, imageCenterY);
          console.log("Crop center:", cropCenterX, cropCenterY);

          // Calculate the top-left corner of the image section that should be drawn
          const sourceX =
            (cropCenterX - imageCenterX) / imageScale + img.width / 2;
          const sourceY =
            (cropCenterY - imageCenterY) / imageScale + img.height / 2;

          // Calculate the width and height of the image section to draw
          const sourceWidth = cropRect.width / imageScale;
          const sourceHeight = cropRect.height / imageScale;

          console.log(
            "Source coordinates:",
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight
          );

          // Ensure we don't try to draw outside the source image
          const safeSourceX = Math.max(0, sourceX - sourceWidth / 2);
          const safeSourceY = Math.max(0, sourceY - sourceHeight / 2);
          const safeSourceWidth = Math.min(
            img.width - safeSourceX,
            sourceWidth
          );
          const safeSourceHeight = Math.min(
            img.height - safeSourceY,
            sourceHeight
          );

          console.log(
            "Safe source coordinates:",
            safeSourceX,
            safeSourceY,
            safeSourceWidth,
            safeSourceHeight
          );

          // Draw the cropped image to the canvas
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the image to the canvas, cropping to the selected area
          ctx.drawImage(
            img,
            safeSourceX,
            safeSourceY,
            safeSourceWidth,
            safeSourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Convert the canvas to a data URL
          const croppedImageUrl = canvas.toDataURL("image/png");

          // Send the cropped image to the parent component
          if (onImageUploaded && billboardId) {
            onImageUploaded(billboardId, croppedImageUrl);

            // Show success message
            setIsSuccess(true);

            // Reset and close after a delay
            setTimeout(() => {
              if (enableCanvasFocus) {
                enableCanvasFocus();
              }
              setIsSuccess(false);
              onClose();
            }, 1500);
          }
        } catch (err) {
          console.error("Error during image cropping:", err);
          alert("Failed to process the image. Please try again.");
        }
      };

      img.onerror = (err) => {
        console.error("Error loading image for cropping:", err);
        alert("Failed to load the image for processing. Please try again.");
      };

      // Load the image to process it
      img.src = previewUrl;
    } catch (err) {
      console.error("Error during crop preparation:", err);
      alert(
        "An error occurred while preparing to crop the image. Please try again."
      );
    }
  };

  // Replace the handleSaveAdjustedImage function with this:
  const handleSaveAdjustedImage = () => {
    cropAndProcessImage();
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 dark"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onFocus={(e) => {
        // Make sure we don't have canvas focus when this component gets focus
        if (disableCanvasFocus) {
          disableCanvasFocus();
        }
      }}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {currentStep === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between px-4 py-2 items-center">
                <h2 className="text-white font-semibold">
                  Upload Content for Billboard #{billboardId}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCloseClick}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center min-h-[400px] relative ${
                    isDragging
                      ? "border-blue-500 bg-blue-500/10"
                      : isSuccess
                      ? "border-green-500 bg-green-500/10"
                      : "border-zinc-700"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <AnimatePresence>
                    {isSuccess ? (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="rounded-full bg-green-500 p-3 mb-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <motion.div
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Check className="h-8 w-8 text-white" />
                          </motion.div>
                        </motion.div>
                        <motion.p
                          className="text-xl font-semibold text-green-500"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Upload successful
                        </motion.p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*,.glb"
                    onChange={handleFileInputChange}
                  />

                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    {isUploading ? (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="rounded-full bg-zinc-800 p-3 border border-zinc-700">
                          <svg
                            className="animate-spin h-10 w-10 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-zinc-400">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-full bg-zinc-800 p-3 border border-zinc-700">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-muted-foreground"
                          >
                            <path
                              d="M12 17V3M12 17L6 11M12 17L18 11"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 21H22"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white">
                            Drop anywhere to import or{" "}
                            <span
                              className="text-blue-400 cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Directly trigger file input click
                                if (fileInputRef.current) {
                                  fileInputRef.current.click();
                                }
                              }}
                            >
                              upload here
                            </span>
                          </h3>
                          <p className="text-zinc-400 mb-4">
                            Upload a single ad or multiple to see further
                            examples
                          </p>
                          <div className="text-sm text-zinc-500">
                            <p className="mb-1">Supported file types:</p>
                            <p>jpeg, png, glb, mp4</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="adjust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <div className="text-center py-4 border-b border-zinc-800">
                <h2 className="text-xl font-medium text-white">
                  Move and Scale
                </h2>
              </div>

              <div
                ref={containerRef}
                className="relative overflow-hidden h-[400px]"
                onMouseMove={handleImageMouseMove}
                onMouseUp={handleImageMouseUp}
                onMouseLeave={handleImageMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {previewUrl && (
                  <div
                    ref={imageRef}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    onMouseDown={handleImageMouseDown}
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                      transformOrigin: "center",
                      transition: isDraggingImage
                        ? "none"
                        : "transform 0.2s ease-out",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                  </div>
                )}

                {/* Overlay with cutout for the crop area */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                  {/* Billboard dimensions display */}
                  <div className="absolute top-2 left-0 right-0 text-center text-white text-xs font-mono">
                    Billboard dimensions: {billboardDimensions.width} ×{" "}
                    {billboardDimensions.height} units
                  </div>

                  <div
                    className="w-4/5 relative"
                    style={{
                      aspectRatio: billboardAspectRatio,
                      maxHeight: "80%",
                      maxWidth: "80%",
                    }}
                  >
                    {/* Transparent cutout */}
                    <div className="absolute inset-0 border-2 border-white rounded-lg">
                      {/* Grid overlay to help with positioning */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border border-white/20" />
                        ))}
                      </div>
                    </div>

                    {/* Create a mask effect by using a box-shadow that extends beyond the container */}
                    <div className="absolute inset-0 shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] rounded-lg"></div>

                    {/* Add label for visual clarity */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Adjust image position and zoom to fit
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-center">
                  <span className="text-sm text-zinc-400 mr-2">Zoom:</span>
                  <Slider
                    defaultValue={[1]}
                    min={0.5}
                    max={3}
                    step={0.01}
                    value={[zoomLevel]}
                    onValueChange={handleZoomChange}
                    className="w-full max-w-xs"
                  />
                </div>

                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="rounded-full bg-green-500 p-3 mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <motion.div
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Check className="h-8 w-8 text-white" />
                        </motion.div>
                      </motion.div>
                      <motion.p
                        className="text-xl font-semibold text-green-500"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Image applied successfully
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="text-white"
                    onClick={handleCancelAdjust}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSaveAdjustedImage}
                  >
                    Apply to Billboard
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
