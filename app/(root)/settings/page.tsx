import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const Settings = () => {
  return (
    <div className=" w-full mt-16 sm:mt-24 p-8 z-20 ">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Personal Info Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Personal info</h2>
        <p className="text-primary-500 border-b border-[#FFFFFF33] pb-6 mb-6">
          Update your photo and personal details here.
        </p>

        {/* Name */}
        <div className="mb-6 flex  items-start md:items-center md:flex-row  w-full border-b gap-4 flex-col border-[#FFFFFF33] pb-6">
          <label className="block text-sm md:w-80 font-medium text-white  ">
            Name<span className="text-primary-50 text-lg">*</span>
          </label>
          <div className="flex space-x-4 w-full">
            <Input
              type="text"
              defaultValue="Olivia"
              className=" w-full p-3 border bg-transparent border-[#FFFFFF33] rounded-lg"
            />
            <Input
              type="text"
              defaultValue="Rhye"
              className=" w-full p-3 border bg-transparent border-[#FFFFFF33] rounded-lg"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="mb-6 flex  items-start md:items-center md:flex-row  w-full border-b gap-4 flex-col border-[#FFFFFF33] pb-6">
          <label className="block text-sm md:w-80  font-medium text-white  ">
            Email address<span className="text-primary-50 text-lg">*</span>
          </label>
          <Input
            type="email"
            defaultValue="olivia@untitledui.com"
            className=" w-full p-3 border bg-transparent border-[#FFFFFF33] rounded-lg"
          />
        </div>

        {/* Your Photo */}
        <div className="mb-6 flex  items-start md:items-center md:flex-row  w-full border-b gap-4 flex-col border-[#FFFFFF33] pb-6">
          <div>
            <label className="block text-sm md:w-80 font-medium text-white  mb-2">
              Your photo<span className="text-primary-50 text-lg">*</span>
            </label>

            <p className="text-sm text-gray-500 mt-2">
              This will be displayed on your profile.
            </p>
          </div>
          <div className=" w-full flex flex-col items-center md:items-start md:flex-row gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src="/avatar.svg"
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full w-full h-full"
              />
            </div>
            <button className=" text-white  flex flex-col items-center p-5 border border-dashed  border-[#FFFFFF33] rounded-2xl w-full sm:w-2/3 ">
              <Image src="/upload.svg" alt="upload" width={50} height={50} />
              <p className="text-primary-500 mt-4 mb-2">
                <span className="text-primary-50 px-1 font-semibold">
                  Click to upload
                </span>
                or drag and drop
              </p>
              <p className="text-primary-500">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </button>
          </div>
        </div>

        {/* Country */}
        <div className="mb-6 flex  items-start md:items-center md:flex-row  w-full border-b gap-4 flex-col border-[#FFFFFF33] pb-6">
          <label className="block text-sm md:w-80 font-medium text-white  mb-2">
            Country<span className="text-primary-50 text-lg">*</span>
          </label>
          <select className="w-full p-3  border bg-transparent border-[#FFFFFF33] rounded-lg">
            <option className="text-black">Australia</option>
            <option className="text-black">Canada</option>
            <option className="text-black">United States</option>
            {/* Add more countries as needed */}
          </select>
        </div>
        <div className="mb-6 flex  items-start md:items-center md:flex-row  w-full border-b gap-4 flex-col border-[#FFFFFF33] pb-6">
          <label className="block text-sm md:w-80  font-medium text-white  ">
            Password<span className="text-primary-50 text-lg">*</span>
          </label>
          <Input
            type="password"
            defaultValue="password"
            className=" w-full p-3 border bg-transparent border-[#FFFFFF33] rounded-lg"
          />
        </div>
      </section>

      {/* Password Section */}
      <div className="flex items-center justify-end gap-4">
        <button className="text-black bg-white px-4 py-3 rounded-lg hover:bg-primary-500">
          Cancel
        </button>
        <button className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
