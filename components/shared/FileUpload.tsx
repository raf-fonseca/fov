"use client";

import type React from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

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

  // React Easy Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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
        // Reset crop values
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      }, 1500);
    }, 1000);
  };

  // Handle Cropper completion
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Generate cropped image using canvas
  const createCroppedImage = async () => {
    if (!previewUrl || !croppedAreaPixels) return null;

    try {
      const image = new Image();
      image.src = previewUrl;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      // Set canvas dimensions to match the cropped area
      const width = croppedAreaPixels.width;
      const height = croppedAreaPixels.height;
      canvas.width = width;
      canvas.height = height;

      // Draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        width,
        height,
        0,
        0,
        width,
        height
      );

      return canvas.toDataURL("image/png");
    } catch (e) {
      console.error("Error creating cropped image: ", e);
      return null;
    }
  };

  const handleApplyImage = async () => {
    if (!billboardId) return;

    try {
      // Show loading state
      setIsUploading(true);

      // Create the cropped image
      const croppedImage = await createCroppedImage();

      if (!croppedImage || !onImageUploaded) {
        throw new Error("Failed to create cropped image");
      }

      // Apply the cropped image to the billboard
      onImageUploaded(billboardId, croppedImage);

      // Show success state
      setIsUploading(false);
      setIsSuccess(true);

      // Close after delay
      setTimeout(() => {
        if (enableCanvasFocus) {
          enableCanvasFocus();
        }
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error applying image:", error);
      setIsUploading(false);
      alert("Failed to process the image. Please try again.");
    }
  };

  const handleCancelAdjust = () => {
    setCurrentStep("upload");
    setPreviewUrl(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
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

              <div className="relative h-[400px] bg-black">
                {previewUrl && (
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={billboardAspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                )}
              </div>

              <div className="p-4 space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <span className="text-sm text-zinc-400 mr-3 w-16">
                      Zoom:
                    </span>
                    <Slider
                      defaultValue={[1]}
                      min={1}
                      max={3}
                      step={0.01}
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      className="flex-1"
                    />
                  </div>
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
                    onClick={handleApplyImage}
                    disabled={isUploading}
                  >
                    {isUploading ? "Processing..." : "Apply to Billboard"}
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
