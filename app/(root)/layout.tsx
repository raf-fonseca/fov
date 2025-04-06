"use client";

import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

const Page = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  return (
    <div
      className={`h-screen ${
        pathname === "/company" ? "flex" : ""
      } bg-[#03060B] `}
    >
      {pathname === "/company" && <Sidebar />}

      <main className=" w-full h-screen overflow-auto flex flex-col items-start relative text-white justify-start pb-3">
        {pathname !== "/company" && (
          <div className="absolute top-0 w-full z-50">
            <Navbar />
          </div>
        )}

        <Image
          src="/glow1.svg"
          alt="404"
          layout="fill"
          objectFit="contain"
          objectPosition="left"
          className="z-0"
        />
        <Image
          src="/glow2.svg"
          alt="404"
          layout="fill"
          objectFit="contain"
          objectPosition="right"
          className="z-0"
        />
        {children}
      </main>
    </div>
  );
};

export default Page;
