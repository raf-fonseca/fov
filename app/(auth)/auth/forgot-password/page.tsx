"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isSent, setIsSent] = React.useState(false);
  const router = useRouter();
  return (
    <section>
      {isSent ? (
        <div className="flex flex-col items-center max-w-[350px] mx-auto gap-4 pt-2 2xl:pt-10 justify-center">
          <Image src="/email.svg" alt="logo" width={50} height={50} />
          <h1 className="text-2xl font-semibold text-white">
            Check your email
          </h1>
          <p className="text-[#FFFFFF80] text-center">
            We sent a password reset link to <br /> olivia@untitledui.com{" "}
          </p>

          <Button
            type="button"
            onClick={() => router.push("/auth/new-password")}
            className=" w-full mt-4 py-3  rounded-[10px] bg-primary-50  inner-shadow "
          >
            Open email app
          </Button>
          <p className="text-[#FFFFFF80] py-4 text-xs 2xl:text-sm text-center">
            Didn’t receive an email?{" "}
            <Link
              href="/auth"
              className="text-primary-50 font-semibold hover:underline"
            >
              Click to Resend
            </Link>
          </p>
          <Link
            href="/auth"
            className="inline-flex gap-2  hover:gap-4 transition-all text-sm  items-center text-primary-500"
          >
            <LucideArrowLeft size={20} />
            Back to log in
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-2 2xl:pt-10 justify-center">
          <Image src="/password.svg" alt="logo" width={50} height={50} />
          <h1 className="text-2xl font-semibold text-white">
            Forgot password?
          </h1>
          <p className="text-[#FFFFFF80]">
            No worries, we’ll send you reset instructions.
          </p>

          <form
            action=""
            className="  flex py-3 gap-1 flex-col  w-full max-w-[350px]"
          >
            <label className="text-[#FFFFFF99] text-sm 2xl:text-base font-normal">
              Email
            </label>

            <Input
              placeholder="enter your email"
              className="px-4  py-3 w-full z-50  placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
            />
            <Button
              type="button"
              onClick={() => setIsSent(true)}
              className=" w-full mt-4 py-3  rounded-[10px] bg-primary-50  inner-shadow "
            >
              Reset password
            </Button>
          </form>
          <Link
            href="/auth"
            className="inline-flex gap-2  hover:gap-4 transition-all text-sm  items-center text-primary-500"
          >
            <LucideArrowLeft size={20} />
            Back to log in
          </Link>
        </div>
      )}
    </section>
  );
};

export default Page;
