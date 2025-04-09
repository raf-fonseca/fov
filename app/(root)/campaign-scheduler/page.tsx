"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Calendar, Link, Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
  });

  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([
    "brainrot-boxfight",
  ]);

  const [isImpressionsLocked, setIsImpressionsLocked] = useState(false);
  const [isBudgetLocked, setIsBudgetLocked] = useState(false);

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
    },
  ]);

  // New state for the date selection
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);

    // Add the date to campaign if it doesn't exist
    if (
      !campaign.selectedDates.some(
        (d) =>
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
      )
    ) {
      setCampaign((prev) => ({
        ...prev,
        selectedDates: [...prev.selectedDates, selectedDate],
        days: prev.selectedDates.length + 1,
      }));
    } else {
      // Remove the date if it already exists
      setCampaign((prev) => {
        const filteredDates = prev.selectedDates.filter(
          (d) =>
            !(
              d.getDate() === selectedDate.getDate() &&
              d.getMonth() === selectedDate.getMonth() &&
              d.getFullYear() === selectedDate.getFullYear()
            )
        );
        return {
          ...prev,
          selectedDates: filteredDates,
          days: filteredDates.length,
        };
      });
    }
  };

  // Calculate days based on impressions and game
  useEffect(() => {
    const selectedGame = GAMES.find((g) => g.id === campaign.gameId);
    if (selectedGame) {
      // Calculate average monthly impressions from the range
      const [minImpressions, maxImpressions] = selectedGame.monthlyImpressions
        .split(" - ")
        .map((imp) => {
          const value = parseFloat(imp.replace(/[^0-9.]/g, ""));
          return imp.includes("B") ? value * 1000000000 : value * 1000000;
        });
      const averageMonthlyImpressions = (minImpressions + maxImpressions) / 2;

      // Calculate daily impressions (average monthly / 30)
      const dailyImpressions = averageMonthlyImpressions / 30;

      // Calculate minimum days needed based on daily impressions
      const minimumDays = Math.ceil(campaign.impressions / dailyImpressions);

      // If no dates are selected yet, auto-populate the calendar
      if (campaign.selectedDates.length === 0) {
        const today = new Date();
        const dates = Array.from({ length: minimumDays }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return date;
        });

        setCampaign((prev) => ({
          ...prev,
          days: minimumDays,
          selectedDates: dates,
        }));
      }
    }
  }, [campaign.impressions, campaign.gameId, campaign.selectedDates.length]);

  // Calculate price based on selected dates
  const calculatePrice = () => {
    const selectedGame = GAMES.find((g) => g.id === campaign.gameId);
    if (!selectedGame) return 0;

    const basePrice = campaign.impressions * 0.001; // $0.001 per impression
    const daysMultiplier =
      campaign.selectedDates.length /
      Math.ceil(campaign.impressions / selectedGame.dailyImpressions);

    // Price increases if fewer days are selected
    const priceMultiplier = daysMultiplier > 1 ? 1.2 : 1;

    return Math.round(basePrice * priceMultiplier);
  };

  const handleUpdateCampaign = (updates: Partial<Campaign>) => {
    setCampaign((prev) => {
      const newCampaign = { ...prev, ...updates };

      // If impressions are being updated, recalculate the dates
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

          // If we need more days than currently selected, add them
          if (minimumDays > newCampaign.selectedDates.length) {
            const lastDate =
              newCampaign.selectedDates[newCampaign.selectedDates.length - 1] ||
              new Date();
            const newDates = Array.from(
              { length: minimumDays - newCampaign.selectedDates.length },
              (_, i) => {
                const date = new Date(lastDate);
                date.setDate(lastDate.getDate() + i + 1);
                return date;
              }
            );

            return {
              ...newCampaign,
              selectedDates: [...newCampaign.selectedDates, ...newDates],
              days: minimumDays,
            };
          }
        }
      }

      return newCampaign;
    });
  };

  const handleTimePeriodSelect = (timeSlots: TimeSlot[]) => {
    setCampaign((prev) => ({
      ...prev,
      selectedTimePeriods: timeSlots,
      selectedDates: Array.from(new Set(timeSlots.map((slot) => slot.date))),
      days: new Set(timeSlots.map((slot) => slot.date)).size,
    }));
  };

  return (
    <div className="flex flex-col gap-6 mt-24 px-10 lg:px-20 pb-24">
      <Card className="bg-[#151825] border-[#2a2d3a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Campaign Configuration
          </CardTitle>
          <CardDescription>Configure your ad campaign settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Settings Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Campaign Settings</h3>

              {/* Regions */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Target Regions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {["US", "EU", "BR", "ASIA", "INTL"].map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={region}
                        checked={campaign.regions.includes(region as Region)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleUpdateCampaign({
                              regions: [...campaign.regions, region as Region],
                            });
                          } else {
                            handleUpdateCampaign({
                              regions: campaign.regions.filter(
                                (r) => r !== region
                              ),
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={region}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
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
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12">
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
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={campaign.impressions.toLocaleString()}
                      onChange={(e) => {
                        const newImpressions = parseInt(
                          e.target.value.replace(/,/g, "")
                        );
                        if (!isNaN(newImpressions)) {
                          handleUpdateCampaign({ impressions: newImpressions });
                        }
                      }}
                      className="bg-[#0a0c14] border-[#2a2d3a]"
                      disabled={isImpressionsLocked}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 p-0",
                        isImpressionsLocked && "text-blue-500"
                      )}
                      onClick={() =>
                        setIsImpressionsLocked(!isImpressionsLocked)
                      }
                    >
                      {isImpressionsLocked ? (
                        <LockOpen className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-4">Budget</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">$</span>
                    <Input
                      type="text"
                      value={calculatePrice().toLocaleString()}
                      onChange={(e) => {
                        const newBudget = parseInt(
                          e.target.value.replace(/,/g, "")
                        );
                        if (!isNaN(newBudget)) {
                          const newImpressions = Math.floor(newBudget / 0.001);
                          handleUpdateCampaign({ impressions: newImpressions });
                        }
                      }}
                      className="bg-[#0a0c14] border-[#2a2d3a]"
                      disabled={isBudgetLocked}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 p-0",
                        isBudgetLocked && "text-blue-500"
                      )}
                      onClick={() => setIsBudgetLocked(!isBudgetLocked)}
                    >
                      {isBudgetLocked ? (
                        <LockOpen className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Schedule Column */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Campaign Schedule</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:cursor-pointer"
                  onClick={() =>
                    setCampaign((prev) => ({ ...prev, selectedDates: [] }))
                  }
                >
                  Reset
                </Button>
              </div>

              <div className="bg-[#0a0c14] rounded-lg p-4 w-full">
                <CalendarComponent
                  mode="multiple"
                  selected={campaign.selectedDates}
                  onSelect={(dates) => {
                    if (!Array.isArray(dates)) return;
                    setCampaign((prev) => ({
                      ...prev,
                      selectedDates: dates,
                      days: dates.length,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
  );
}
