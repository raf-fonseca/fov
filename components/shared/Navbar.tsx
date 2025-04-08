"use client";
import Image from "next/image";
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
  const router = useRouter();

  return (
    <nav className="w-full wrapper py-5 flex items-center justify-between border-b border-gray-800 mb-8">
      {/* Logo */}
      <Link href={"/"}>
        <div className="flex-shrink-0">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </div>
      </Link>
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
