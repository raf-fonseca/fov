import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const ScheduleMeet = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-50 inner-shadow mt-5 flex items-center gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold text-sm 2xl:text-base text-white py-4 ">
          Schedule a meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-primary-50/30 py-12 rounded-[12px] bg-[#040911]">
        <DialogHeader className="flex flex-col items-center gap-2.5">
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            className="mb-5
          "
            alt="calendar"
          />
          <DialogTitle className="text-primary-50  text-3xl tracking-wide">
            Meet Scheduled!
          </DialogTitle>
          <DialogDescription className="text-white text-center">
            Our team, will reach you. Please keep on checking your mail.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeet;
