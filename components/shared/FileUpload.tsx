"use client";

import type React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import * as THREE from "three";

interface FileUploadProps {
  onClose: () => void;
  billboardId: number | null;
  onImageUploaded?: (billboardId: number, textureUrl: string) => void;
}

export default function FileUpload({
  onClose,
  billboardId,
  onImageUploaded,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!billboardId) return;

    setUploadStatus("Processing...");

    // Check if file is an image
    if (
      !file.type.match("image.*") &&
      !file.type.match("video.*") &&
      file.type !== "model/gltf+json" &&
      !file.name.endsWith(".glb")
    ) {
      setUploadStatus("Error: Unsupported file type");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;

      // Pass the texture URL to parent component
      if (onImageUploaded && billboardId) {
        onImageUploaded(billboardId, result);
        setUploadStatus("Upload successful!");

        // Close the popup after a delay
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    };

    reader.onerror = () => {
      setUploadStatus("Error: Failed to process file");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 dark">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between px-4 py-2 items-center">
          <h2 className="text-white font-semibold">
            Upload Content for Billboard #{billboardId}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center min-h-[400px] ${
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-zinc-700"
            } ${
              uploadStatus === "Upload successful!" ? "border-green-500" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*,.glb"
              onChange={handleFileInputChange}
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {uploadStatus ? (
                <div className="text-center">
                  <div
                    className={`text-xl font-semibold ${
                      uploadStatus === "Upload successful!"
                        ? "text-green-400"
                        : "text-white"
                    }`}
                  >
                    {uploadStatus}
                  </div>
                  {uploadStatus === "Upload successful!" && (
                    <div className="mt-2 text-green-400">
                      <svg
                        className="w-20 h-20 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
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
                      Drop anywhere to import
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Upload a{" "}
                      <span className="text-blue-400 cursor-pointer">
                        single ad
                      </span>{" "}
                      or{" "}
                      <span className="text-blue-400 cursor-pointer">
                        multiple
                      </span>{" "}
                      to see further examples
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
      </div>
    </div>
  );
}
