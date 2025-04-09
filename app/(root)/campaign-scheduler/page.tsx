"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Calendar,
  Link as LinkIcon,
  Lock,
  LockOpen,
  Check,
  ChevronsUpDown,
  X,
  ArrowUp,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { GoogleCalendar } from "@/components/google-calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { GameInfo } from "@/app/types";
import { format, addDays, differenceInDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangeCalendar } from "@/components/date-range-calendar";

export type Region = "US" | "EU" | "BR" | "ASIA" | "INTL";
export type DeliverySpeed = "drip" | "balanced" | "burst";
export type TimePeriod = "12AM-8AM" | "8AM-4PM" | "4PM-12AM";

export interface TimeSlot {
  date: Date;
  period: TimePeriod;
}

export interface Campaign {
  id: string;
  name: string;
  days: number;
  impressions: number;
  regions: Region[];
  deliverySpeed: DeliverySpeed;
  selectedTimeSlots: number[];
  gameId: string;
  color: string;
  selectedDates: Date[];
  selectedTimePeriods: TimeSlot[];
  dateRange: { start: Date | null; end: Date | null };
}

// Sample game data with thumbnails
const GAMES: GameInfo[] = [
  {
    id: "brainrot-boxfight",
    name: "Brainrot Boxfight",
    type: "COMBAT",
    platforms: ["PC", "PS4", "XBOX"],
    monthlyImpressions: "1.5B - 25B+",
    monthlyPlayers: "10M - 25M",
    demographics: {
      ageRange: "12-18 y/o",
      regions: ["US", "UK"],
    },
    dailyImpressions: 12000000,
    thumbnailUrl: "brainrotBoxfights.png",
    color: "#ef4444",
    platformDistribution: [
      { platform: "PC", percentage: 85 },
      { platform: "PS4", percentage: 10 },
      { platform: "XBOX", percentage: 5 },
    ],
  },
  {
    id: "crazy-rvb",
    name: "Crazy RVB: Winter Wrath",
    type: "CREATIVE",
    platforms: ["PC", "PS4", "XBOX"],
    monthlyImpressions: "800M - 15B+",
    monthlyPlayers: "8M - 20M",
    demographics: {
      ageRange: "10-16 y/o",
      regions: ["US", "EU", "BR"],
    },
    dailyImpressions: 8000000,
    thumbnailUrl: "redVblue.png",
    color: "#10b981",
    platformDistribution: [
      { platform: "PC", percentage: 60 },
      { platform: "PS4", percentage: 25 },
      { platform: "XBOX", percentage: 15 },
    ],
  },
  {
    id: "escape-caseoh",
    name: "Escape Caseoh",
    type: "SOCIAL",
    platforms: ["ALL"],
    monthlyImpressions: "500M - 10B+",
    monthlyPlayers: "5M - 15M",
    demographics: {
      ageRange: "13-21 y/o",
      regions: ["US", "EU", "INTL"],
    },
    dailyImpressions: 5000000,
    thumbnailUrl: "crazyRed.png",
    color: "#3b82f6",
    platformDistribution: [
      { platform: "PC", percentage: 70 },
      { platform: "PS4", percentage: 20 },
      { platform: "XBOX", percentage: 10 },
    ],
  },
];

export default function CampaignScheduler() {
  const today = new Date();
  const [campaign, setCampaign] = useState<Campaign>({
    id: "camp-1",
    name: "New Campaign",
    days: 7,
    impressions: 5000000000,
    regions: ["US"],
    deliverySpeed: "balanced",
    selectedTimeSlots: [],
    gameId: "brainrot-boxfight",
    color: "#3b82f6",
    selectedDates: [],
    selectedTimePeriods: [],
    dateRange: {
      start: today,
      end: addDays(today, 7),
    },
  });

  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([
    "brainrot-boxfight",
  ]);

  // Sample data for other campaigns (in a real app, this would come from an API)
  const [otherCampaigns] = useState<Campaign[]>([
    {
      id: "camp-2",
      name: "Nike Campaign",
      days: 14,
      impressions: 8000000,
      regions: ["US", "EU"],
      deliverySpeed: "burst",
      selectedTimeSlots: [18, 19, 20, 21],
      gameId: "crazy-rvb",
      color: "#ef4444",
      selectedDates: [
        new Date(2025, 2, 15),
        new Date(2025, 2, 16),
        new Date(2025, 2, 17),
        new Date(2025, 2, 18),
        new Date(2025, 2, 19),
      ],
      selectedTimePeriods: [],
      dateRange: {
        start: new Date(2025, 2, 15),
        end: new Date(2025, 2, 19),
      },
    },
    {
      id: "camp-3",
      name: "Coca-Cola Campaign",
      days: 10,
      impressions: 6000000,
      regions: ["US", "BR"],
      deliverySpeed: "balanced",
      selectedTimeSlots: [14, 15, 16, 17],
      gameId: "escape-caseoh",
      color: "#10b981",
      selectedDates: [
        new Date(2025, 2, 20),
        new Date(2025, 2, 21),
        new Date(2025, 2, 22),
        new Date(2025, 2, 23),
        new Date(2025, 2, 24),
        new Date(2025, 2, 25),
        new Date(2025, 2, 26),
        new Date(2025, 2, 27),
      ],
      selectedTimePeriods: [],
      dateRange: {
        start: new Date(2025, 2, 20),
        end: new Date(2025, 2, 27),
      },
    },
  ]);

  // Calculate days based on selected range
  useEffect(() => {
    if (campaign.dateRange?.start && campaign.dateRange?.end) {
      // Calculate days between start and end dates (inclusive)
      const daysDiff =
        differenceInDays(campaign.dateRange.end, campaign.dateRange.start) + 1;

      // Update campaign days
      setCampaign((prev) => ({
        ...prev,
        days: daysDiff,
      }));
    }
  }, [campaign.dateRange]);

  // Calculate price based on selected date range
  const calculatePrice = () => {
    const selectedGame = GAMES.find((g) => g.id === campaign.gameId);
    if (!selectedGame) return 0;

    const basePrice = campaign.impressions * 0.001; // $0.001 per impression

    // Days multiplier based on date range
    const daysMultiplier =
      campaign.days /
      Math.ceil(campaign.impressions / selectedGame.dailyImpressions);

    // Price increases if fewer days are selected
    const priceMultiplier = daysMultiplier > 1 ? 1.2 : 1;

    return Math.round(basePrice * priceMultiplier);
  };

  const handleUpdateCampaign = (updates: Partial<Campaign>) => {
    setCampaign((prev) => {
      const newCampaign = { ...prev, ...updates };

      // If impressions are being updated, recalculate the days if needed
      if (updates.impressions !== undefined) {
        const selectedGame = GAMES.find((g) => g.id === newCampaign.gameId);
        if (selectedGame) {
          // Calculate average monthly impressions from the range
          const [minImpressions, maxImpressions] =
            selectedGame.monthlyImpressions.split(" - ").map((imp) => {
              const value = parseFloat(imp.replace(/[^0-9.]/g, ""));
              return imp.includes("B") ? value * 1000000000 : value * 1000000;
            });
          const averageMonthlyImpressions =
            (minImpressions + maxImpressions) / 2;

          // Calculate daily impressions (average monthly / 30)
          const dailyImpressions = averageMonthlyImpressions / 30;

          // Calculate minimum days needed based on daily impressions
          const minimumDays = Math.ceil(updates.impressions / dailyImpressions);

          // If we need more days than currently selected, extend the date range
          if (
            !newCampaign.dateRange?.start ||
            !newCampaign.dateRange?.end ||
            newCampaign.days < minimumDays
          ) {
            const startDate = newCampaign.dateRange?.start || new Date();
            const endDate = addDays(startDate, minimumDays - 1);

            return {
              ...newCampaign,
              dateRange: {
                start: startDate,
                end: endDate,
              },
              days: minimumDays,
            };
          }
        }
      }

      return newCampaign;
    });
  };

  // Update the days when campaign.impressions changes
  useEffect(() => {
    const selectedGame = GAMES.find((g) => g.id === campaign.gameId);
    if (
      selectedGame &&
      (!campaign.dateRange.start || !campaign.dateRange.end)
    ) {
      // If no date range is set, calculate one based on impressions
      const dailyImpressions = selectedGame.dailyImpressions;
      const minimumDays = Math.ceil(campaign.impressions / dailyImpressions);

      const startDate = new Date();
      const endDate = addDays(startDate, minimumDays - 1);

      setCampaign((prev) => ({
        ...prev,
        dateRange: {
          start: startDate,
          end: endDate,
        },
        days: minimumDays,
      }));
    }
    // Return void to satisfy EffectCallback
    return;
  }, [campaign.impressions, campaign.gameId]);

  const handleTimePeriodSelect = (timeSlots: TimeSlot[]) => {
    setCampaign((prev) => ({
      ...prev,
      selectedTimePeriods: timeSlots,
      selectedDates: Array.from(new Set(timeSlots.map((slot) => slot.date))),
      days: new Set(timeSlots.map((slot) => slot.date)).size,
    }));
  };

  // Get a formatted string of selected regions
  const getSelectedRegionsText = () => {
    if (campaign.regions.length === 0) return "No regions selected";
    if (campaign.regions.length === 5) return "All regions";
    return campaign.regions.join(", ");
  };

  const toggleRegion = (region: Region) => {
    const isSelected = campaign.regions.includes(region);

    if (isSelected) {
      // Remove region
      handleUpdateCampaign({
        regions: campaign.regions.filter((r) => r !== region),
      });
    } else {
      // Add region
      handleUpdateCampaign({
        regions: [...campaign.regions, region],
      });
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (range: {
    start: Date | null;
    end: Date | null;
  }) => {
    setCampaign((prev) => ({
      ...prev,
      dateRange: range,
    }));
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 mt-24 px-10 lg:px-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campaign Settings Card */}
          <Card className="bg-[#151825] border-[#2a2d3a]">
            <CardHeader>
              <CardTitle className="text-lg">Campaign Settings</CardTitle>
              <CardDescription>Adjust your campaign parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Regions - Dropdown Menu */}
              <div className="space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger className=" bg-slate-950 border border-slate-800 text-left font-normal rounded-md p-2 flex items-center gap-2 w-40  ">
                      <span>Target Regions</span>
                      <ChevronsUpDown className="h-4 w-4 opacity-50 ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-50 bg-[#18181A] border-none w-56 mt-2 rounded-sm text-white">
                      {["US", "EU", "BR", "ASIA", "INTL"].map(
                        (region, index) => {
                          const isSelected = campaign.regions.includes(
                            region as Region
                          );
                          return (
                            <DropdownMenuItem
                              key={region}
                              onClick={() => toggleRegion(region as Region)}
                              className={cn(
                                "py-2 font-semibold flex items-center",
                                index === 0 && "pt-4"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                                <span>{region}</span>
                              </div>
                            </DropdownMenuItem>
                          );
                        }
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateCampaign({
                            regions: ["US", "EU", "BR", "ASIA", "INTL"],
                          })
                        }
                        className="pt-2 pb-2 font-semibold"
                      >
                        Select All
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateCampaign({ regions: [] })}
                        className="pt-2 pb-4 font-semibold"
                      >
                        Clear Selection
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {campaign.regions.length > 0 && (
                    <div className="flex items-center gap-1.5 ml-3">
                      <div className="flex items-center justify-center bg-green-100 text-green-700 rounded-full p-1 bg-green-300/30">
                        <ArrowUp
                          className="h-3 w-3 transform text-green-400"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-green-400 font-medium">
                        +${campaign.regions.length * 100}
                      </span>
                    </div>
                  )}
                </div>

                {/* Selected Regions Badges */}
                {campaign.regions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {campaign.regions.map((region) => (
                      <Badge
                        key={region}
                        variant="outline"
                        className="bg-primary-50 text-white flex items-center py-1 px-2 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none"
                      >
                        {region}
                        <button
                          onClick={() => toggleRegion(region)}
                          className="ml-1.5 bg-primary-50 rounded-full p-0.5 hover:bg-primary-50/20 p-0 focus:outline-none focus:ring-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Campaign Duration */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Campaign Duration (Days)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Slider
                      value={[campaign.days]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(value) => {
                        handleUpdateCampaign({ days: value[0] });

                        // Update end date if start date exists
                        if (campaign.dateRange.start) {
                          const newEndDate = addDays(
                            campaign.dateRange.start,
                            value[0] - 1
                          );
                          setCampaign((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              end: newEndDate,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium ">
                    {campaign.days} days
                  </span>
                </div>
              </div>

              {/* Impressions and Budget */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Target Impressions
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Input
                          type="text"
                          disabled
                          value={campaign.impressions.toLocaleString()}
                          onChange={(e) => {
                            const newImpressions = parseInt(
                              e.target.value.replace(/,/g, "")
                            );
                            if (!isNaN(newImpressions)) {
                              handleUpdateCampaign({
                                impressions: newImpressions,
                              });
                            }
                          }}
                          className="bg-[#0a0c14] border-[#2a2d3a] cursor-not-allowed"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1a1d2d] border-[#2a2d3a] text-white p-0">
                      <Link href="/campaign-builder">
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-start gap-2 text-white hover:bg-slate-800 hover:text-white py-3"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>
                            Go to Campaign Builder to adjust impressions
                          </span>
                        </Button>
                      </Link>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        $
                      </span>
                      <Input
                        type="text"
                        value={calculatePrice().toLocaleString()}
                        onChange={(e) => {
                          const newBudget = parseInt(
                            e.target.value.replace(/,/g, "")
                          );
                          if (!isNaN(newBudget)) {
                            const newImpressions = Math.floor(
                              newBudget / 0.001
                            );
                            handleUpdateCampaign({
                              impressions: newImpressions,
                            });
                          }
                        }}
                        className="bg-[#0a0c14] border-[#2a2d3a] pl-7"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Schedule Card */}
          <Card className="bg-[#151825] border-[#2a2d3a]">
            <CardHeader className="flex flex-col gap-2">
              <div className="flex w-full justify-between items-center">
                <CardTitle className="text-lg">Campaign Schedule</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:cursor-pointer ml-auto"
                  onClick={() =>
                    setCampaign((prev) => ({
                      ...prev,
                      dateRange: {
                        start: null,
                        end: null,
                      },
                      days: 7,
                    }))
                  }
                >
                  Reset
                </Button>
              </div>
              <CardDescription>
                Select a start and end date for your campaign.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg w-full">
                <DateRangeCalendar
                  onRangeSelect={handleDateRangeSelect}
                  initialRange={campaign.dateRange}
                  className="bg-slate-950 text-white border-slate-800"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky bottom section */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 z-50">
          <div className="max-w-[1200px] mx-auto px-10 lg:px-20 py-4">
            <div className="flex justify-end">
              {/* <Link href="/campaign-scheduler"> */}
              <Button className="bg-primary-50 hover:bg-primary-50/70 px-8 text-white">
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
