"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <section>
      <div className="flex flex-col items-center max-w-[400px] mx-auto gap-4 pt-2 2xl:pt-20 justify-center">
        <Image src="/confirm.svg" alt="logo" width={50} height={50} />
        <h1 className="text-2xl font-semibold text-white">Password Reset</h1>
        <p className="text-[#FFFFFF80] text-center">
          Your password has been successfully reset. <br /> Click below to log
          in magically.
        </p>

        <Button
          onClick={() => router.push("/auth/signin")}
          // type="button"
          className=" w-full mt-4 py-3 text-white text-center rounded-[10px] bg-primary-50  inner-shadow "
        >
          Continue
        </Button>

        <Link
          href="/auth"
          className="inline-flex hover:gap-4 transition-all gap-2 text-sm  items-center text-primary-500"
        >
          <LucideArrowLeft size={20} />
          Back to log in
        </Link>
      </div>
    </section>
  );
};

export default Page;
