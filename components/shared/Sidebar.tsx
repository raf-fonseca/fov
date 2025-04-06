"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MdHelp } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
interface ILink {
  name: string;
  icon: [JSX.Element, JSX.Element];
  href: string;
}

const links = [
  { name: "Dashboard", href: "/dashboard", image: "/dashboard.svg" },
  { name: "Ad Campaign", href: "/ad-campaign", image: "/ad.svg" },
  { name: "Company", href: "/company", image: "/company.svg" },
  // { name: "FOV Chat", href: "#", image: "/chat.svg" },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div>
      <div className="bg-slate-200 flex h-screen antialiased text-slate-300 selection:bg-blue-600 selection:text-white">
        {/* SideBar */}
        <div
          id="menu"
          className="hidden relative p-8 lg:block bg-[#03060B] border-r border-gray-900 h-full   overflow-x-hidden text-slate-300  w-64 2xl:w-80  overflow-y-auto pb-8"
        >
          <Link href={"/"}>
            <Image src="/logo.svg" alt="404" width={90} height={90} />
          </Link>
          <div className="flex my-6 xl:my-10 items-center gap-2 w-full border border-[#FFFFFF33] p-2 rounded-xl">
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

          <div className="flex flex-col gap-4">
            {links.map((link, index) => (
              <Link key={index} href={link.href}>
                <p
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-[10px] text-xs 2xl:text-base mt-2 w-full  text-slate-200 
                  ${
                    pathname === link.href
                      ? "bg-primary-50/30 text-white "
                      : "hover:bg-[#FFFFFF33] hover:text-white "
                  }
                  `}
                >
                  <Image src={link.image} alt="404" width={20} height={20} />
                  {link.name}
                </p>
              </Link>
            ))}
          </div>
          <Link href={"/settings"}>
            <div className=" border border-[#FFFFFF33] p-3 rounded-xl absolute bottom-10 w-[80%] flex items-center gap-2">
              <Image
                src="/avatar.svg"
                alt="404"
                width={35}
                height={35}
                className="rounded-full"
              />
              <div>
                <p className="text-sm text-white">John Doe</p>
                <p className="text-xs text-primary-500">Admin</p>
              </div>
            </div>
          </Link>
        </div>
        {/* Movbile Sidebar */}
        <div className="flex z-50 lg:hidden ">
          <input
            type="checkbox"
            id="drawer-toggle"
            className="relative sr-only peer"
            // defaultChecked
          />
          <label
            htmlFor="drawer-toggle"
            className="absolute mt-[10%] opacity-80 left-2 inline-block p-4 transition-all duration-500 bg-primary-50 rounded-lg peer-checked:rotate-180 peer-checked:left-64"
          >
            <div className="w-5 h-1 mb-2 rotate-45 bg-white rounded-lg" />
            <div className="w-5 h-1 -rotate-45 bg-white rounded-lg" />
          </label>
          <div className=" fixed top-0  transition-all duration-500 transform -translate-x-full rounded-tr-3xl rounded-br-3xl  shadow-lg peer-checked:translate-x-0 bg-black min-h-screen  text-slate-300 w-64 z-30  left-0 h-screen overflow-y-scroll pb-8">
            <div id="logo" className="my-16 px-8">
              <h1 className="text-lg md:text-2xl font-bold pb-2 text-white mb-2">
                News App
              </h1>
            </div>
            {/* <Navlinks links={links} /> */}
            <div className="flex flex-col gap-4 px-8">
              {links.map((link, index) => (
                <Link key={index} href={link.href}>
                  <p className="flex items-center gap-3 text-xs 2xl:text-base mt-2 w-full  text-slate-200  ">
                    <Image src={link.image} alt="404" width={20} height={20} />
                    {link.name}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href={"/settings"}
              className={
                "flex absolute bottom-3 font-semibold  items-center gap-4  w-full p-4 text-brown/100  "
              }
            >
              <div className=" border border-[#FFFFFF33] p-3 rounded-xl absolute bottom-10 w-[80%] flex items-center gap-2">
                <Image
                  src="/avatar.svg"
                  alt="404"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm text-white">John Doe</p>
                  <p className="text-xs text-primary-500">Admin</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        {/* Mobile Sidebar end */}
      </div>
    </div>
  );
};

export default Sidebar;
