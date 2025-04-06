"use client";

import Link from "next/link";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Using the same campaign data structure from dashboard
interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalImpressions: number;
  impressionsPerPlay: number;
  engagementLift: number;
  platformBreakdown: {
    pc: number;
    console: number;
    mobile: number;
  };
  regionDistribution: {
    northAmerica: number;
    europe: number;
    asiaPacific: number;
    latinAmerica: number;
    middleEastAfrica: number;
    oceania: number;
  };
}

// Sample campaign data
const campaigns: Campaign[] = [
  {
    id: "summer-splash-2023",
    name: "Summer Splash Event",
    description:
      "Interactive ad campaign running in Fortnite Creative Zone Wars",
    startDate: "June 15, 2023",
    endDate: "July 15, 2023",
    totalImpressions: 2500000,
    impressionsPerPlay: 12.4,
    engagementLift: 15.3,
    platformBreakdown: {
      pc: 45,
      console: 35,
      mobile: 20,
    },
    regionDistribution: {
      northAmerica: 40,
      europe: 35,
      asiaPacific: 20,
      latinAmerica: 2,
      middleEastAfrica: 2,
      oceania: 1,
    },
  },
  {
    id: "fall-campaign-2023",
    name: "Fall Campaign",
    description: "Seasonal promotion featuring Halloween themed content",
    startDate: "September 5, 2023",
    endDate: "October 31, 2023",
    totalImpressions: 1800000,
    impressionsPerPlay: 10.2,
    engagementLift: 12.8,
    platformBreakdown: {
      pc: 42,
      console: 38,
      mobile: 20,
    },
    regionDistribution: {
      northAmerica: 45,
      europe: 30,
      asiaPacific: 18,
      latinAmerica: 3,
      middleEastAfrica: 2,
      oceania: 2,
    },
  },
  // Add more campaigns as needed
];

export default function CampaignLibrary() {
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background dark mt-24 px-10 lg:px-20">
      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="space-y-6 ">
          {campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/ads`} className="block">
              <Card className="overflow-hidden border-slate-800 bg-slate-900 py-0 group hover:bg-slate-800 transition-colors">
                <div className="grid grid-cols-2 gap-6 h-full">
                  {/* Campaign Image */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-slate-700 group-hover:to-slate-800 flex items-center justify-center text-slate-500 h-full transition-colors">
                    Campaign Photo
                  </div>

                  {/* Campaign Details */}
                  <div className="p-4 flex flex-col justify-between">
                    {/* Header */}
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-white">
                        {campaign.name}
                      </h2>
                      <p className="text-sm text-slate-400 line-clamp-1">
                        {campaign.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {campaign.startDate} - {campaign.endDate}
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Total Impressions */}
                      <div>
                        <h3 className="text-xs font-medium text-slate-400">
                          Total Impressions
                        </h3>
                        <p className="text-sm font-bold text-white">
                          {formatNumber(campaign.totalImpressions)}
                        </p>
                      </div>

                      {/* Impressions per Play */}
                      <div>
                        <h3 className="text-xs font-medium text-slate-400">
                          Impressions/Play
                        </h3>
                        <p className="text-sm font-bold text-white">
                          {campaign.impressionsPerPlay.toFixed(1)}
                        </p>
                      </div>

                      {/* Engagement Lift */}
                      <div>
                        <h3 className="text-xs font-medium text-slate-400">
                          Engagement Lift
                        </h3>
                        <p className="text-sm font-bold text-green-500">
                          +{campaign.engagementLift.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Distribution Section */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {/* Platform Split */}
                      <div>
                        <h3 className="text-xs font-medium text-slate-400 mb-2">
                          Platform Split
                        </h3>
                        <div className="space-y-1">
                          {Object.entries(campaign.platformBreakdown).map(
                            ([platform, percentage]) => (
                              <div key={platform} className="group relative">
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-slate-400 capitalize">
                                    {platform}
                                  </span>
                                  <span className="text-slate-400">
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor:
                                        platform === "pc"
                                          ? "#0ea5e9"
                                          : platform === "console"
                                          ? "#8b5cf6"
                                          : "#10b981",
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Region Split */}
                      <div>
                        <h3 className="text-xs font-medium text-slate-400 mb-2">
                          Region Split
                        </h3>
                        <div className="space-y-1">
                          {Object.entries(campaign.regionDistribution)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([region, percentage]) => (
                              <div key={region} className="group relative">
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-slate-400">
                                    {region
                                      .replace(/([A-Z])/g, " $1")
                                      .trim()
                                      .split(" ")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")
                                      .replace("And", "&")}
                                  </span>
                                  <span className="text-slate-400">
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
