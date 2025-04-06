"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navlinks array
  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "/dashboard.svg" },
    { name: "Ad Campaign", href: "/ad-campaign", icon: "/ad.svg" },
    { name: "Company", href: "/company", icon: "/company.svg" },
    // { name: "FOV Chat", href: "/fov-chat" },
  ];
  const router = useRouter();

  return (
    <nav className="w-full wrapper py-5 flex items-center justify-between border-b border-gray-800 mb-8">
      {/* Logo */}
      <Link href={"/"}>
        <div className="flex-shrink-0">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </div>
      </Link>

      <div
        className={`hidden md:flex md:items-center md:space-x-4 lg:space-x-6 xl:space-x-10 mx-4`}
      >
        {navLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className=" inline-flex items-center gap-1.5 text-white  text-sm 2xl:text-base hover:underline "
          >
            <Image src={link.icon} alt={link.name} width={20} height={20} />
            {link.name}
          </Link>
        ))}
      </div>

      <Sheet>
        <SheetTrigger className=" md:hidden">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </SheetTrigger>
        <SheetContent className="bg-[#03060B] text-white border-none">
          <SheetHeader className="mb-6">
            <Image src="/logo.svg" alt="logo" width={70} height={70} />
          </SheetHeader>
          <div
            className={` flex items-center justify-center w-full h-full flex-col gap-4  pb-64`}
          >
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block text-white  text-sm lg:text-base py-2 md:py-0"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={"/auth"}
              className="bg-primary w-3/4 text-center px-4 2xl:px-6 font-semibold text-sm 2xl:text-base text-white py-2.5 2xl:py-3 rounded-md"
            >
              Log In
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Login Button */}
      {/* <Link
        href={"/auth"}
        className="bg-primary hidden md:block px-4 2xl:px-6 font-semibold text-sm 2xl:text-base text-white py-2.5 2xl:py-3 rounded-md"
      >
        Log In
      </Link> */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FiMenu className="text-lg text-white 2xl:text-xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" z-50 bg-[#18181A] border-none w-56 mr-16 mt-2 rounded-sm text-white">
          <DropdownMenuItem
            onClick={() => router.push("/dashboard")}
            className=" pt-4  font-semibold "
          >
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/ad-campaign")}
            className="py-2  font-semibold "
          >
            Configurator
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/fov-chat")}
            className=" pt-4  font-semibold "
          >
            Try FOV Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/company")}
            className="py-2  font-semibold "
          >
            Inventory
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/auth")}
            className="pt-2 pb-4  font-semibold text-primary-50 "
          >
            Login
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
