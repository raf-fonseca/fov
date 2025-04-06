"use client";
import Image from "next/image";
import { useState } from "react";
const campaigns = [
  { id: 1, name: "Campaign 1", active: true },
  { id: 2, name: "Campaign 2", active: false },
  { id: 3, name: "Campaign 3", active: false },
];

const slots = [
  {
    title: "Crazy Red Vs Blue",
    impressions: "1.5B - 25B+",
    details: [
      {
        title: "Central Arena",
        impressions: "1.8B",
        desc: "Great for a branded still or animated PRIME billboard!",
      },
      {
        title: "Upper Grind Rail",
        impressions: "2B",
        desc: "Optimal for your new flavor PRIME 3D bottle rotating over the Arena",
      },
    ],
  },
  {
    title: "Brainrot Boxfights",
    impressions: "300M - 5B+",
    details: [
      {
        title: "Meme Wall Right",
        impressions: "350M",
        desc: "Red PRIME logos would contrast with the background and increase performance the most!",
      },
      {
        title: "Meme Wall Left",
        impressions: "350M",
        desc: "Red PRIME logos would contrast with the background and increase performance the most!",
      },
      // {
      //   title: "Arena Flooring",
      //   impressions: "300M",
      //   desc: "A 2D insert of your new PRIME bottle would perform the best here!",
      // },
    ],
  },
];

export default function ChatWithFOV() {
  const [selectedCampaign, setSelectedCampaign] = useState(1);

  return (
    <div className="bg-[#101723] mt-28 z-50    text-white  rounded-[12px] w-full max-w-3xl mx-auto ">
      <div className="bg-[#161F2E] px-8 py-6 rounded-tr-[12px] rounded-tl-[12px]">
        <h2 className="text-lg font-semibold">Chat with FOV</h2>
      </div>
      <div className="flex gap-4 px-8 py-5">
        <div className="bg-[#233045] p-2.5 rounded-[12px] h-fit">
          <Image alt="hehe" src="/emoji.svg" width={60} height={60} />
        </div>
        <div className="">
          <p className=" bg-[#233045] px-5 py-2.5 rounded-md text-sm w-fit">
            Here's an optimal go-to-market campaign for your new flavor launch!
          </p>

          <div className="flex gap-2 mt-3">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                className={`px-4 text-xs 2xl:text-sm py-1.5 2xl:py-2 rounded-[9px] bg-[#233045]  ${
                  selectedCampaign === campaign.id
                    ? "border-2 border-primary-50 "
                    : "border border-[#35455F]"
                }`}
                onClick={() => setSelectedCampaign(campaign.id)}
              >
                {campaign.name}
              </button>
            ))}
          </div>

          <p className="mt-4 bg-[#233045] px-5 py-2.5 rounded-md text-xs 2xl:text-sm w-fit">
            These 5 ad slots will provide optimal exposure to the proper
            demographic to make your product launch as impactful as possible:
          </p>

          {slots.map((slot, index) => (
            <div key={index} className="mt-4 w-fit">
              <div className="flex items-center bg-[#233045] w-fit px-5 py-2.5 rounded-[12px]">
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-3">
                    <Image src="/game.png" alt="logo" width={75} height={100} />
                    {slot.title} Mo. Impressions: {slot.impressions}
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 w-fit pr-12 gap-2 mt-2">
                {slot.details.map((detail, idx) => (
                  <div key={idx} className=" p-3 bg-[#233045] rounded-[12px]">
                    <h4 className="font-semibold text-white  2xl:text-lg">
                      {detail.title}
                    </h4>
                    <h4 className="font-semibold mb-2 text-xs 2xl:text-sm text-[#42E34A]">
                      {detail.impressions} Impressions in 3 weeks
                    </h4>
                    <p className="text-xs 2xl:text-sm">{detail.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 mx-4 bg-[#233045] px-5 py-4 rounded-[12px] flex items-center">
        <input
          type="text"
          placeholder="Your message here..."
          className="w-full bg-transparent border-none outline-none text-white"
        />
      </div>
    </div>
  );
}
