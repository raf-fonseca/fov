import Image from "next/image";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="  min-h-svh relative">
      <Image
        src="/bgGlow.svg"
        alt="404"
        layout="fill"
        objectFit="contain"
        objectPosition="right"
        className="z-0 hidden md:block"
      />
      <div className="flex justify-center py-12">
        <Image src="/logo.svg" alt="404" width={90} height={90} />
      </div>
      <div className="z-20 relative ">{children}</div>
    </div>
  );
};

export default layout;
