"use client";

import Link from "next/link";
import { Package, Play } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Ad {
  id: string;
  name: string;
  campaign: string;
  totalImpressions: number;
  impressionsPerPlay: number;
  engagementLift: number;
  screenPercentage: number;
  viewability: number;
  totalDwellTime: number;
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

// Sample ads data
const ads: Ad[] = [
  {
    id: "beach-party-banner",
    name: "Beach Party Banner",
    campaign: "Summer Splash Event",
    totalImpressions: 1200000,
    impressionsPerPlay: 12.4,
    engagementLift: 15.3,
    screenPercentage: 42,
    viewability: 90,
    totalDwellTime: 12.5,
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
    id: "summer-splash-logo",
    name: "Summer Splash Logo",
    campaign: "Summer Splash Event",
    totalImpressions: 980000,
    impressionsPerPlay: 10.2,
    engagementLift: 12.8,
    screenPercentage: 38,
    viewability: 85,
    totalDwellTime: 9.7,
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
];

export default function AdLibrary() {
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background dark mt-24 px-10 lg:px-20">
      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="space-y-6">
          {ads.map((ad) => (
            <Card
              key={ad.id}
              className="overflow-hidden border-slate-800 bg-slate-900 py-0"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Ad Image */}
                <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500">
                  <Play className="h-12 w-12" />
                </div>

                {/* Ad Details */}
                <div className="p-4">
                  {/* Header */}
                  <div className="mb-3">
                    <h2 className="text-xl font-bold text-white">{ad.name}</h2>
                    <p className="text-sm text-slate-400">
                      From campaign: {ad.campaign}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {/* Total Impressions */}
                    <div>
                      <h3 className="text-xs font-medium text-slate-400">
                        Total Impressions
                      </h3>
                      <p className="text-sm font-bold text-white">
                        {formatNumber(ad.totalImpressions)}
                      </p>
                    </div>

                    {/* Impressions per Play */}
                    <div>
                      <h3 className="text-xs font-medium text-slate-400">
                        Impressions/Play
                      </h3>
                      <p className="text-sm font-bold text-white">
                        {ad.impressionsPerPlay.toFixed(1)}
                      </p>
                    </div>

                    {/* Engagement Lift */}
                    <div>
                      <h3 className="text-xs font-medium text-slate-400">
                        Engagement Lift
                      </h3>
                      <p className="text-sm font-bold text-green-500">
                        +{ad.engagementLift.toFixed(1)}%
                      </p>
                    </div>

                    {/* Total Dwell Time */}
                    <div>
                      <h3 className="text-xs font-medium text-slate-400">
                        Dwell Time
                      </h3>
                      <p className="text-sm font-bold text-white">
                        {ad.totalDwellTime.toFixed(1)}s
                      </p>
                    </div>

                    {/* Screen Coverage */}
                    <div>
                      <h3 className="text-xs font-medium text-slate-400">
                        Screen Coverage
                      </h3>
                      <p className="text-sm font-bold text-white">
                        {ad.screenPercentage}%
                      </p>
                    </div>

                    {/* Viewability */}
                    <div>
                      <h3 className="text-xs font-medium text-slate-400">
                        Viewability
                      </h3>
                      <p className="text-sm font-bold text-white">
                        {ad.viewability}%
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
                        {Object.entries(ad.platformBreakdown).map(
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
                        {Object.entries(ad.regionDistribution)
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
          ))}
        </div>
      </main>
    </div>
  );
}
