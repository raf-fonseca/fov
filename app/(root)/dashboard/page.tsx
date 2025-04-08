"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Menu,
  MenuIcon,
  Package,
  Play,
  Radio,
  Image,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Define types for campaign and tooltip data
interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  totalImpressions: number;
  impressionsPerPlay: number;
  engagementLift: number;
  totalDwellTime: number;
  screenPercentage: number;
  viewability: number;
  progress: number;
  status: "live" | "completed" | "upcoming";
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

interface TooltipInfo {
  visible: boolean;
  campaign: Campaign | null;
  position: {
    x: number;
    y: number;
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
    totalDwellTime: 12.5,
    screenPercentage: 42,
    viewability: 90,
    progress: 49.8,
    status: "live" as const,
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
    totalDwellTime: 9.7,
    screenPercentage: 38,
    viewability: 85,
    progress: 60,
    status: "live" as const,
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
  {
    id: "winter-wonderland-2022",
    name: "Winter Wonderland",
    description: "Holiday themed campaign with special winter items",
    startDate: "Dec 2022",
    endDate: "Feb 2023",
    totalImpressions: 2800000,
    impressionsPerPlay: 11.5,
    engagementLift: 18.2,
    totalDwellTime: 11.3,
    screenPercentage: 45,
    viewability: 92,
    progress: 100,
    status: "completed" as const,
    platformBreakdown: {
      pc: 40,
      console: 42,
      mobile: 18,
    },
    regionDistribution: {
      northAmerica: 42,
      europe: 36,
      asiaPacific: 16,
      latinAmerica: 3,
      middleEastAfrica: 2,
      oceania: 1,
    },
  },
  {
    id: "spring-break-2023",
    name: "Spring Break Event",
    description: "Spring themed campaign with exclusive items",
    startDate: "Mar",
    endDate: "May 2023",
    totalImpressions: 3200000,
    impressionsPerPlay: 13.2,
    engagementLift: 22.5,
    totalDwellTime: 14.1,
    screenPercentage: 48,
    viewability: 94,
    progress: 100,
    status: "completed" as const,
    platformBreakdown: {
      pc: 38,
      console: 40,
      mobile: 22,
    },
    regionDistribution: {
      northAmerica: 44,
      europe: 32,
      asiaPacific: 18,
      latinAmerica: 3,
      middleEastAfrica: 2,
      oceania: 1,
    },
  },
  {
    id: "back-to-school-2022",
    name: "Back to School",
    description: "Back to school themed items and promotions",
    startDate: "Aug",
    endDate: "Oct 2022",
    totalImpressions: 2100000,
    impressionsPerPlay: 9.8,
    engagementLift: 16.4,
    totalDwellTime: 10.2,
    screenPercentage: 40,
    viewability: 88,
    progress: 100,
    status: "completed" as const,
    platformBreakdown: {
      pc: 36,
      console: 44,
      mobile: 20,
    },
    regionDistribution: {
      northAmerica: 48,
      europe: 28,
      asiaPacific: 16,
      latinAmerica: 4,
      middleEastAfrica: 2,
      oceania: 2,
    },
  },
  {
    id: "summer-2024",
    name: "Summer 2024 Campaign",
    description: "Upcoming summer campaign with new features and content",
    startDate: "June 1, 2024",
    endDate: "August 31, 2024",
    totalImpressions: 3200000,
    impressionsPerPlay: 14.2,
    engagementLift: 18.5,
    totalDwellTime: 13.7,
    screenPercentage: 45,
    viewability: 92,
    progress: 0,
    status: "upcoming" as const,
    platformBreakdown: {
      pc: 42,
      console: 38,
      mobile: 20,
    },
    regionDistribution: {
      northAmerica: 44,
      europe: 32,
      asiaPacific: 18,
      latinAmerica: 3,
      middleEastAfrica: 2,
      oceania: 1,
    },
  },
];

// Sample ads data
const ads = [
  {
    id: "beach-party-banner",
    name: "Beach Party Banner",
    campaign: "Summer Splash Event",
    impressions: "1.2M",
    type: "image",
  },
  {
    id: "summer-splash-logo",
    name: "Summer Splash Logo",
    campaign: "Summer Splash Event",
    impressions: "980K",
    type: "image",
  },
  {
    id: "beach-party-promo",
    name: "Beach Party Promo",
    campaign: "Summer Splash Event",
    impressions: "720K",
    type: "video",
  },
];

// Generate daily impressions data for chart
const generateDailyImpressions = () => {
  const data = [];
  let baseValue = 25; // Starting value in millions

  for (let i = 1; i <= 30; i++) {
    // Add some randomness to the data
    const randomFactor = Math.random() * 0.1;
    const randomDirection = Math.random() > 0.3 ? 1 : -1;

    // Increase values over time with some fluctuation
    baseValue = Math.max(
      baseValue + baseValue * randomFactor * randomDirection + 1,
      20
    );

    data.push({
      day: i,
      impressions: Math.round(baseValue),
    });
  }

  return data;
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState(0);
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo>({
    visible: false,
    campaign: null,
    position: { x: 0, y: 0 },
  });

  // Add mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipInfo.visible) {
      setTooltipInfo((prev) => ({
        ...prev,
        position: { x: e.clientX, y: e.clientY },
      }));
    }
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const currentCampaign = campaigns[currentCampaignIndex];
  const dailyImpressions = generateDailyImpressions();

  const navigateCampaign = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentCampaignIndex((prev) =>
        prev === 0 ? campaigns.length - 1 : prev - 1
      );
    } else {
      setCurrentCampaignIndex((prev) =>
        prev === campaigns.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Calculate total impressions across all campaigns
  const totalImpressions = campaigns.reduce(
    (sum, campaign) => sum + campaign.totalImpressions,
    0
  );

  return (
    <div className="flex min-h-screen flex-col bg-background dark mt-24">
      {/* Main content */}
      <main className="flex-1 px-2 ">
        <div className="container mx-auto">
          {/* Notification banner for upcoming campaigns */}
          {currentCampaign.status === "upcoming" && (
            <div className="mb-4 p-3 rounded-lg bg-blue-900/50 border border-blue-700 text-blue-100">
              <p className="text-sm">
                Note: The following metrics for this upcoming campaign are
                projected estimates only, not actual performance data.
              </p>
            </div>
          )}

          {/* Featured Campaign Section - Takes up upper half of screen */}
          <div className="relative mb-6">
            {/* Live Indicator */}
            {currentCampaign.status === "live" && (
              <div className="absolute -left-4 -top-4 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-400 ring-2 ring-sky-500/50 z-[100]">
                <div className="flex flex-row gap-2 items-center">
                  <Radio className="h-3 w-3 animate-pulse" /> LIVE NOW
                </div>
              </div>
            )}

            {/* Upcoming Indicator */}
            {currentCampaign.status === "upcoming" && (
              <div className="absolute -left-4 -top-4 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400 ring-2 ring-yellow-500/50 z-[100]">
                <div className="flex flex-row gap-2 items-center">UPCOMING</div>
              </div>
            )}

            {/* Completed Indicator */}
            {currentCampaign.status === "completed" && (
              <div className="absolute -left-4 -top-4 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 ring-2 ring-green-500/50 z-[100]">
                <div className="flex flex-row gap-2 items-center">
                  COMPLETED
                </div>
              </div>
            )}

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
              {/* Navigation arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900/80 rounded-full h-10 w-10"
                onClick={() => navigateCampaign("prev")}
              >
                <ArrowLeft className="h-6 w-6" />
                <span className="sr-only">Previous Campaign</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900/80 rounded-full h-10 w-10"
                onClick={() => navigateCampaign("next")}
              >
                <ArrowRight className="h-6 w-6" />
                <span className="sr-only">Next Campaign</span>
              </Button>

              <div className="flex items-center justify-between px-4 pt-2">
                <div className="flex-1 mr-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.min(currentCampaign.progress, 100)}
                        className="h-2 bg-slate-800 [&>div]:bg-sky-500 flex-1"
                      />
                      <span className="text-sm font-medium text-white">
                        {currentCampaign.progress}%
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/campaigns">
                    Campaign Library <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-6 gap-4 p-4">
                {/* First Row */}

                <Card className="col-span-4 bg-slate-950 border-slate-800 py-0">
                  <CardHeader className="p-3 bg-gradient-to-r from-sky-950 to-slate-950 rounded-t-[13px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xs text-slate-400">
                          Daily Impressions
                        </CardTitle>
                        <p className="text-xs text-slate-500">
                          All impressions over campaign duration
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {formatNumber(currentCampaign.totalImpressions)}
                        </p>
                        <p className="text-xs text-slate-400">Impressions</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyImpressions}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          tickLine={{ stroke: "#475569" }}
                          axisLine={{ stroke: "#475569" }}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          tickLine={{ stroke: "#475569" }}
                          axisLine={{ stroke: "#475569" }}
                          tickFormatter={(value) => `${value}M`}
                          width={35}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "none",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                            fontSize: "12px",
                          }}
                          formatter={(value: number) => [
                            `${value}M`,
                            "Impressions",
                          ]}
                          labelFormatter={(label) => `Day ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="impressions"
                          stroke="hsl(199 95% 50%)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: "hsl(199 95% 50%)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                {currentCampaign.status === "upcoming" && (
                  <Card className="col-span-2 bg-slate-950 border-slate-800 py-0 h-[280px]">
                    <div className="flex flex-col h-full">
                      <CardHeader className="p-3 pb-0">
                        <CardTitle className="text-lg">
                          Uploaded Media
                        </CardTitle>
                        <CardDescription>Campaign assets</CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1 flex-1 overflow-auto">
                        <div className="space-y-2">
                          {/* Sample uploaded media items */}
                          <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-red-800 to-orange-700 flex items-center justify-center">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  Campaign Video
                                </p>
                                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">
                                  Approved
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">2.5 GB</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-800 to-cyan-700 flex items-center justify-center">
                              <Package className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">3D model</p>
                                <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">
                                  Pending
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">1.2 GB</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center">
                              <Image className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  Campaign Banner
                                </p>
                                <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
                                  Uploaded
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">0.8 GB</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <div className="p-3 pt-0">
                        <Button variant="outline" className="w-full">
                          Upload Media
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                <Card
                  className={`${
                    currentCampaign.status === "live" ||
                    currentCampaign.status === "completed"
                      ? "col-span-2"
                      : "hidden"
                  } bg-gradient-to-r from-sky-950 to-slate-950 border-0`}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-white mb-1">
                        {currentCampaign.name}
                      </h2>
                      <p className="text-sm text-slate-300 line-clamp-1">
                        {currentCampaign.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Second Row */}
                {/* Stats Section */}
                {currentCampaign.status === "live" ||
                currentCampaign.status === "completed" ? (
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {/* Total Impressions */}
                    <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className="text-xs text-slate-400">
                          Total Impressions
                        </CardTitle>
                        <CardDescription className="text-xl font-bold text-white ">
                          {formatNumber(currentCampaign.totalImpressions)}
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Impressions per Play */}
                    <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className="text-xs text-slate-400">
                          Impressions per Play
                        </CardTitle>
                        <CardDescription className="text-xl font-bold text-white">
                          {currentCampaign.impressionsPerPlay.toFixed(1)}
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Engagement Lift */}
                    <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className="text-xs text-slate-400">
                          Engagement Lift
                        </CardTitle>
                        <CardDescription className="text-xl font-bold text-green-500">
                          +{currentCampaign.engagementLift.toFixed(1)}%
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Total Dwell Time */}
                    <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className="text-xs text-slate-400">
                          Total Dwell Time
                        </CardTitle>
                        <CardDescription className="text-xl font-bold text-white">
                          {currentCampaign.totalDwellTime.toFixed(1)}s
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ) : (
                  <div className="col-span-2 flex flex-col gap-4">
                    {/* Stats cards row */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Total Impressions */}
                      <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                        <CardHeader className="p-2 pb-0">
                          <CardTitle className="text-xs text-slate-400">
                            Total Impressions
                          </CardTitle>
                          <CardDescription className="text-xl font-bold text-white">
                            {formatNumber(currentCampaign.totalImpressions)}
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      {/* Impressions per Play */}
                      <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                        <CardHeader className="p-2 pb-0">
                          <CardTitle className="text-xs text-slate-400">
                            Impressions per Play
                          </CardTitle>
                          <CardDescription className="text-xl font-bold text-white">
                            {currentCampaign.impressionsPerPlay.toFixed(1)}
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      {/* Engagement Lift */}
                      <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                        <CardHeader className="p-2 pb-0">
                          <CardTitle className="text-xs text-slate-400">
                            Engagement Lift
                          </CardTitle>
                          <CardDescription className="text-xl font-bold text-green-500">
                            +{currentCampaign.engagementLift.toFixed(1)}%
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      {/* Total Dwell Time */}
                      <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                        <CardHeader className="p-2 pb-0">
                          <CardTitle className="text-xs text-slate-400">
                            Total Dwell Time
                          </CardTitle>
                          <CardDescription className="text-xl font-bold text-white">
                            {currentCampaign.totalDwellTime.toFixed(1)}s
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>

                    {/* Campaign Schedule */}
                    <Card className="bg-slate-950 border-slate-800 py-0 pb-1">
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className="text-lg">
                          Campaign Schedule
                        </CardTitle>
                        <CardDescription className="pt-4 text-xl text-white space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">
                              Start Date
                            </span>
                            <span className="text-sm font-medium">
                              {currentCampaign.startDate}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">
                              End Date
                            </span>
                            <span className="text-sm font-medium">
                              {currentCampaign.endDate}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                )}

                {/* Screen & Viewability and Platform Breakdown */}
                <div className="col-span-2 space-y-4">
                  {/* Screen & Viewability */}
                  <Card className="bg-slate-950 border-slate-800 py-0 pb-4">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-lg">
                        Screen & Viewability
                      </CardTitle>
                      <CardDescription className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-400">
                              % Screen Coverage
                            </span>
                            <span className="text-xs">
                              {currentCampaign.screenPercentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{
                                width: `${currentCampaign.screenPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-400">
                              Viewability
                            </span>
                            <span className="text-xs">
                              {currentCampaign.viewability}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{
                                width: `${currentCampaign.viewability}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Platform Breakdown */}
                  <Card className="bg-slate-950 border-slate-800 py-0 pb-4">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-lg">
                        Platform Breakdown
                      </CardTitle>
                      <CardDescription className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-400">PC</span>
                            <span className="text-xs">
                              {currentCampaign.platformBreakdown.pc}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{
                                width: `${currentCampaign.platformBreakdown.pc}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-400">
                              Console
                            </span>
                            <span className="text-xs">
                              {currentCampaign.platformBreakdown.console}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{
                                width: `${currentCampaign.platformBreakdown.console}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Region Distribution */}
                <Card className="col-span-2 bg-slate-950 border-slate-800 py-0">
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-lg">
                      Region Distribution
                    </CardTitle>
                    <CardDescription className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">
                            North America
                          </span>
                          <span className="text-xs">
                            {currentCampaign.regionDistribution.northAmerica}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${currentCampaign.regionDistribution.northAmerica}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">Europe</span>
                          <span className="text-xs">
                            {currentCampaign.regionDistribution.europe}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{
                              width: `${currentCampaign.regionDistribution.europe}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">
                            Asia Pacific
                          </span>
                          <span className="text-xs">
                            {currentCampaign.regionDistribution.asiaPacific}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${currentCampaign.regionDistribution.asiaPacific}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">
                            Latin America
                          </span>
                          <span className="text-xs">
                            {currentCampaign.regionDistribution.latinAmerica}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${currentCampaign.regionDistribution.latinAmerica}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">
                            Middle East & Africa
                          </span>
                          <span className="text-xs">
                            {
                              currentCampaign.regionDistribution
                                .middleEastAfrica
                            }
                            %
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: `${currentCampaign.regionDistribution.middleEastAfrica}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-400">
                            Oceania
                          </span>
                          <span className="text-xs">
                            {currentCampaign.regionDistribution.oceania}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 rounded-full"
                            style={{
                              width: `${currentCampaign.regionDistribution.oceania}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Previous Campaigns, Ads, and Total Impressions Section */}
      <div className="container mx-auto pb-4 px-10">
        <div className="grid grid-cols-6 gap-4">
          {/* Previous Campaigns */}
          <Card className="col-span-2 overflow-hidden border-slate-800 bg-slate-950 py-0 pb-4">
            <div className="flex flex-col h-[300px]">
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-lg">Previous Campaigns</CardTitle>
                <CardDescription>All previous campaigns</CardDescription>
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-auto">
                <div className="space-y-2">
                  {[
                    {
                      name: "Spring Break Event",
                      date: "Mar - May 2023",
                      impressions: "3.2M",
                    },
                    {
                      name: "Winter Wonderland",
                      date: "Dec 2022 - Feb 2023",
                      impressions: "2.8M",
                    },
                    {
                      name: "Back to School",
                      date: "Aug - Oct 2022",
                      impressions: "2.1M",
                    },
                  ].map((campaign) => (
                    <Link
                      href={`/dashboard/campaigns`}
                      key={campaign.name}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg border border-slate-800 p-2 hover:bg-slate-800 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{campaign.name}</p>
                          <p className="text-xs text-slate-400">
                            {campaign.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {campaign.impressions}
                          </p>
                          <p className="text-xs text-slate-400">impressions</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0 mt-auto border-t border-slate-800">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/campaigns">View All Campaigns</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>

          {/* Previous Ads */}
          <Card className="col-span-2 border-slate-800 bg-slate-950 py-0">
            <div className="flex flex-col h-[300px]">
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-lg">Previous Ads</CardTitle>
                <CardDescription>Recent ads from all campaigns</CardDescription>
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-auto">
                <div className="space-y-2">
                  {ads.map((ad) => (
                    <Link href={`/dashboard/ads`} key={ad.id} className="block">
                      <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <div className="w-12 h-12 rounded-md bg-gradient-to-r from-orange-800 to-red-800 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{ad.name}</p>
                          <p className="text-xs text-slate-400">
                            {ad.campaign}
                          </p>
                          <p className="text-xs text-slate-400">
                            {ad.impressions} impressions
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0 mt-auto border-t border-slate-800">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/ads">View All Ads</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>

          {/* Total Impressions Chart */}
          <Card className="col-span-2 bg-slate-950 border-slate-800 py-0">
            <div className="flex flex-col h-full">
              <CardHeader className="p-3 pb-0">
                <CardTitle className="text-lg">Total Impressions</CardTitle>
                <CardDescription>
                  Total impressions for all campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 flex-1 flex items-center justify-center">
                <div
                  className="relative w-48 h-48"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() =>
                    setTooltipInfo((prev) => ({
                      ...prev,
                      visible: false,
                    }))
                  }
                >
                  {tooltipInfo.visible && tooltipInfo.campaign && (
                    <div
                      className="fixed z-50 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
                      style={{
                        top: tooltipInfo.position.y - 10,
                        left: tooltipInfo.position.x + 10,
                      }}
                    >
                      <p className="font-medium">
                        {tooltipInfo.campaign?.name}
                      </p>
                      <p className="text-sm text-slate-300">
                        {formatNumber(
                          tooltipInfo.campaign?.totalImpressions || 0
                        )}{" "}
                        impressions
                      </p>
                    </div>
                  )}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M50,50 L50,10 A40,40 0 0,1 83.6,73.6 Z"
                      fill="#0ea5e9"
                      className="transition-opacity hover:brightness-125"
                      onMouseEnter={() => {
                        setTooltipInfo({
                          visible: true,
                          campaign: campaigns[0],
                          position: tooltipInfo.position,
                        });
                      }}
                    />
                    <path
                      d="M50,50 L83.6,73.6 A40,40 0 0,1 16.4,73.6 Z"
                      fill="#8b5cf6"
                      className="transition-opacity hover:brightness-125"
                      onMouseEnter={() => {
                        setTooltipInfo({
                          visible: true,
                          campaign: campaigns[1],
                          position: tooltipInfo.position,
                        });
                      }}
                    />
                    <path
                      d="M50,50 L16.4,73.6 A40,40 0 0,1 50,10 Z"
                      fill="#10b981"
                      className="transition-opacity hover:brightness-125"
                      onMouseEnter={() => {
                        setTooltipInfo({
                          visible: true,
                          campaign: campaigns[2],
                          position: tooltipInfo.position,
                        });
                      }}
                    />
                    <circle cx="50" cy="50" r="30" fill="#0f172a" />
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      className="text-sm font-bold"
                    >
                      {(totalImpressions / 1000000).toFixed(1)}M
                    </text>
                  </svg>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
