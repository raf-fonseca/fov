"use client";
import Image from "next/image";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const [tab, setTab] = React.useState("login");
  const router = useRouter();
  const signupSchema = z.object({
    name: z.string().min(2, {
      message: "name must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(2, {
        message: "name must be at least 2 characters.",
      })
      .email({
        message: "Invalid email address.",
      }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const loginSchema = z.object({
    email: z
      .string()
      .min(2, {
        message: "Email address required.",
      })
      .email({
        message: "Invalid email address.",
      }),
    password: z.string().min(1, {
      message: "Password required.",
    }),
  });

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
  }
  function onSigninSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    router.push("/dashboard");
  }

  return (
    <div className=" wrapper   ">
      <div className="flex flex-col  pb-20 items-center gap-5 max-w-md mx-auto">
        <h2 className="text-xl 2xl:text-2xl text-white font-semibold">
          Create an account
        </h2>
        <div className="flex z-50 items-center  border border-[#FFFFFF33] rounded-[8px] w-full">
          <button
            onClick={() => setTab("signup")}
            className={`

          ${
            tab === "signup"
              ? "bg-[#FFFFFF33] text-white  border border-[#FFFFFF33] "
              : "bg-transparent text-gray-300"
          } px-4 py-2.5  w-full font-semibold rounded-[8px]`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab("login")}
            className={`
          ${
            tab === "login"
              ? "bg-[#FFFFFF33] text-white  border border-[#FFFFFF33] "
              : "bg-transparent text-gray-300"
          } px-4 py-2.5   w-full font-semibold rounded-[8px]`}
          >
            Log In
          </button>
        </div>
        {tab === "signup" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSignupSubmit)}
              className="space-y-4 z-50  w-full "
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#FFFFFF80] font-normal capitalize">
                      name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter your name"
                        className="px-4 py-3 z-50 placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  w-full bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#FFFFFF80] font-normal capitalize">
                      email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter your email"
                        className="px-4 py-3 z-50 placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  w-full bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#FFFFFF80] font-normal capitalize">
                      password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter your password"
                        className="px-4 py-3 z-50 placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  w-full bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-white text-sm ">
                      Must be at least 8 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  className=" w-full py-3  rounded-[10px] bg-primary-50 text-white inner-shadow"
                >
                  Get Started
                </Button>
                <Button
                  type="button"
                  className=" w-full py-3 bg-transparent border border-[#FFFFFF33] rounded-[10px] "
                >
                  <FcGoogle className="w-6 h-6" />
                  Sign up with Google
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...signInForm}>
            <form
              onSubmit={signInForm.handleSubmit(onSigninSubmit)}
              className="space-y-4 z-50  w-full "
            >
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#FFFFFF80] font-normal capitalize">
                      email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter your email"
                        className="px-4 py-3 z-50 placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  w-full bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#FFFFFF80] font-normal capitalize">
                      password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter your password"
                        className="px-4 py-3 z-50 placeholder:text-[#FFFFFF99] placeholder:font-normal  text-sm 2xl:text-base  w-full bg-[#040911] text-[#FFFFFF99] font-normal rounded-[8px]  border border-[#FFFFFF33]  bg-transparent"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center py-1 justify-between ">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" className="border-[#FFFFFFB2] border" />
                  <label
                    htmlFor="terms"
                    className="text-sm text-[#FFFFFFB2] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember for 30 days
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-50 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  className=" w-full py-3  rounded-[10px] bg-primary-50 text-white  inner-shadow  "
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  className=" w-full py-3 bg-transparent border border-[#FFFFFF33] rounded-[10px] "
                >
                  <FcGoogle className="w-6 h-6" />
                  Sign up with Google
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Page;
