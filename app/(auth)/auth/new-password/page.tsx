"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <section className="pb-12">
      <div className="flex flex-col items-center gap-4 pt-2 2xl:pt-4 justify-center">
        <Image src="/newPassword.svg" alt="logo" width={50} height={50} />
        <h1 className="text-2xl font-semibold text-white">Set new password</h1>
        <p className="text-[#FFFFFF80] text-center">
          Your new password must be different to <br /> previously used
          passwords.{" "}
        </p>

        <form
          action=""
          className="  flex py-3 gap-1 flex-col  w-full max-w-[400px]"
        >
          <label className="text-primary-500 text-sm 2xl:text-base font-normal">
            Password
          </label>
          <Input
            placeholder="enter password"
            className="px-4  py-3 w-full z-50  placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
          />

          <label className="text-primary-500 mt-4 text-sm 2xl:text-base font-normal">
            Confirm password
          </label>
          <Input
            placeholder="Confirm password"
            className="px-4  py-3 w-full z-50  placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
          />
          <p className="text-white text-sm mb-1 ">
            Must be at least 8 characters.
          </p>
          <Link
            href={"/auth/password-changed"}
            // type="button"
            className=" w-full mt-4 py-3  inner-shadow  text-white text-center rounded-[10px] bg-primary-50"
          >
            Reset password
          </Link>
        </form>
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
