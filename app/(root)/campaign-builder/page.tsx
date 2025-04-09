"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, ImageIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AdSlot {
  id: string;
  name: string;
  impressions: [number, number]; // [min, max] in millions
  imageUrl?: string; // Optional image URL
}

interface Game {
  id: string;
  name: string;
  adSlots: AdSlot[];
}

export default function CampaignBuilder() {
  // This would come from your external source
  const [games, setGames] = useState<Game[]>([
    {
      id: "crazy-rvb",
      name: "Crazy RVB",
      adSlots: [
        {
          id: "slot1",
          name: "Wall Banner",
          impressions: [1, 2],
          imageUrl: "/p2.svg",
        },
        {
          id: "slot2",
          name: "Loading Screen",
          impressions: [0.5, 1.5],
          imageUrl: "/p2.svg",
        },
        {
          id: "slot3",
          name: "Menu Banner",
          impressions: [2, 4],
          imageUrl: "/p2.svg",
        },
      ],
    },
    {
      id: "brain-rot",
      name: "Brain Rot",
      adSlots: [
        {
          id: "slot4",
          name: "Main Menu",
          impressions: [1, 3],
          imageUrl: "/p2.svg",
        },
        {
          id: "slot5",
          name: "Leaderboard",
          impressions: [2, 5],
          imageUrl: "/p2.svg",
        },
      ],
    },
    {
      id: "dragon",
      name: "Dragon",
      adSlots: [
        {
          id: "slot6",
          name: "Loading Banner",
          impressions: [3, 6],
          imageUrl: "/p2.svg",
        },
        {
          id: "slot7",
          name: "In-Game Billboard",
          impressions: [1, 2],
          imageUrl: "/p2.svg",
        },
        {
          id: "slot8",
          name: "Pause Menu",
          impressions: [2, 4],
          imageUrl: "/p2.svg",
        },
      ],
    },
  ]);

  const [impressionRanges, setImpressionRanges] = useState<
    Record<string, [number, number]>
  >({});

  const [totalImpressions, setTotalImpressions] = useState<number>(0);
  const [minimumGuaranteed, setMinimumGuaranteed] = useState<number>(0);
  const [shadowImpressions, setShadowImpressions] = useState<
    Record<string, [number, number]>
  >({});
  const [isShadowActive, setIsShadowActive] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [tempTotalImpressions, setTempTotalImpressions] = useState<string>("");

  // Dialog-specific state (using Dialog instead of Sheet/Drawer)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [originalValues, setOriginalValues] = useState<[number, number]>([
    0, 0,
  ]);
  const [newValues, setNewValues] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Calculate minimum guaranteed impressions based on selected slots
  useEffect(() => {
    const totalMin = games.reduce((sum, game) => {
      return (
        sum +
        game.adSlots.reduce((gameSum, slot) => {
          const range = impressionRanges[slot.id] || slot.impressions;
          return gameSum + range[0];
        }, 0)
      );
    }, 0);
    setMinimumGuaranteed(totalMin);
  }, [games, impressionRanges]);

  // Distribute impressions when confirmed
  const distributeImpressions = (total: number) => {
    // Count total slots
    const allSlots = games.flatMap((game) => game.adSlots);
    const slotCount = allSlots.length;

    if (slotCount === 0) return;

    // Calculate approximate even distribution
    const baseImpressionsPerSlot = total / slotCount;

    // Create wider variance (±20% range)
    const variance = baseImpressionsPerSlot * 0.2; // 20% variance in each direction for a wider range

    // Create new impression ranges
    const newRanges: Record<string, [number, number]> = {};

    allSlots.forEach((slot) => {
      // Create a range around the base value with some variance
      const minValue = Math.max(0, baseImpressionsPerSlot - variance);
      const maxValue = baseImpressionsPerSlot + variance;

      // Store the new range
      newRanges[slot.id] = [minValue, maxValue];
    });

    // Update the impression ranges
    setImpressionRanges(newRanges);
  };

  const updateSlotImpressions = (slotId: string, value: [number, number]) => {
    if (!isShadowActive) {
      setImpressionRanges((prev) => ({
        ...prev,
        [slotId]: value,
      }));
    } else {
      setShadowImpressions((prev) => ({
        ...prev,
        [slotId]: value,
      }));
    }
  };

  const handleTotalImpressionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Remove commas to get the actual numeric value
    const rawValue = e.target.value.replace(/,/g, "");
    setTempTotalImpressions(rawValue);

    // Validation happens during input as well
    if (rawValue === "") {
      setInputError("");
      return;
    }

    const numValue = parseFloat(rawValue);

    if (isNaN(numValue)) {
      setInputError("Please enter a valid number");
    } else if (numValue < 1.0) {
      // This validates any number from 0 to 0.999999
      setInputError(
        "Ad slots combined generate a minimum of 1 million impressions per day"
      );
    } else {
      setInputError("");
    }
  };

  const confirmTotalImpressions = () => {
    if (tempTotalImpressions === "") {
      setInputError("Please enter a value");
      return;
    }

    const numValue = parseFloat(tempTotalImpressions);

    if (isNaN(numValue)) {
      setInputError("Please enter a valid number");
      return;
    }

    if (numValue < 1.0) {
      // This validates any number from 0 to 0.999999
      setInputError(
        "Ad slots combined generate a minimum of 1 million impressions per day"
      );
      return;
    }

    // Set total impressions
    setTotalImpressions(numValue);
    setInputError("");
    setIsConfirmed(true);

    // Distribute impressions across all ad slots (pass value in millions)
    distributeImpressions(numValue);
  };

  const resetConfirmation = () => {
    setIsConfirmed(false);
    setTempTotalImpressions(totalImpressions.toString());
  };

  const applyShadowChanges = () => {
    setImpressionRanges(shadowImpressions);
    setShadowImpressions({});
    setIsShadowActive(false);
  };

  const cancelShadowChanges = () => {
    setShadowImpressions({});
    setIsShadowActive(false);
  };

  const startShadowMovement = () => {
    setShadowImpressions({ ...impressionRanges });
    setIsShadowActive(true);
  };

  const removeAdSlot = (gameId: string, slotId: string) => {
    setGames(
      games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            adSlots: game.adSlots.filter((slot) => slot.id !== slotId),
          };
        }
        return game;
      })
    );
  };

  // Slider interaction handlers
  const handleSliderChange = (slotId: string, value: [number, number]) => {
    if (!isDragging) {
      setIsDragging(true);
      setActiveSlotId(slotId);

      // Store original value first
      const originalValue = isShadowActive
        ? shadowImpressions[slotId] ||
          impressionRanges[slotId] ||
          games.flatMap((g) => g.adSlots).find((s) => s.id === slotId)
            ?.impressions || [0, 0]
        : impressionRanges[slotId] ||
          games.flatMap((g) => g.adSlots).find((s) => s.id === slotId)
            ?.impressions || [0, 0];

      setOriginalValues(originalValue);
    }

    // Only update the newValues for preview, don't change the actual data yet
    setNewValues(value);
  };

  const handleSliderChangeEnd = (slotId: string) => {
    if (isDragging) {
      setIsDragging(false);
      setDialogOpen(true);
    }
  };

  // For displaying the slider values correctly after confirmation
  const getCurrentSliderValues = (slot: AdSlot) => {
    if (isDragging && activeSlotId === slot.id) {
      return [newValues[0], newValues[1]];
    }

    if (isShadowActive) {
      return (
        shadowImpressions[slot.id] ||
        impressionRanges[slot.id] ||
        slot.impressions
      );
    }

    return impressionRanges[slot.id] || slot.impressions;
  };

  // Recalculate the slider scale value
  const getSliderMax = () => {
    // Get all slots
    const allSlots = games.flatMap((game) => game.adSlots);
    if (allSlots.length === 0) return 10;

    // Find maximum impression value
    let maxValue = 0;
    allSlots.forEach((slot) => {
      const values = impressionRanges[slot.id] || slot.impressions;
      maxValue = Math.max(maxValue, values[1]);
    });

    // Add a buffer and round to a nice number
    return Math.max(10, Math.ceil(maxValue * 1.2));
  };

  // Fixed max value for all sliders
  const sliderMax = getSliderMax();

  // Dialog action handlers
  const applyRedistribute = () => {
    if (activeSlotId) {
      if (isShadowActive) {
        setShadowImpressions((prev) => ({
          ...prev,
          [activeSlotId]: newValues,
        }));
      } else {
        setImpressionRanges((prev) => ({
          ...prev,
          [activeSlotId]: newValues,
        }));
      }
    }
    handleDialogClose();
  };

  const applyIncreaseTotal = () => {
    const originalSum = originalValues[0] + originalValues[1];
    const newSum = newValues[0] + newValues[1];
    const diff = newSum - originalSum;

    // Update the total impressions with the new value
    const newTotal = totalImpressions + diff;
    setTotalImpressions(newTotal);

    // Reset confirmation state to allow editing the input field
    setIsConfirmed(false);
    setTempTotalImpressions(newTotal.toString());

    // Close the dialog
    handleDialogClose();

    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Add a small delay and focus on the input field if possible
    setTimeout(() => {
      const inputElement = document.querySelector(
        'input[value="' + newTotal + '"]'
      );
      if (inputElement instanceof HTMLElement) {
        inputElement.focus();
      }
    }, 500);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setActiveSlotId(null);
  };

  // Helper function to format numbers with suffixes
  const formatNumberWithSuffix = (num: number): string => {
    if (num === 0) return "0";

    const abbreviations = [
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
    ];

    const abbreviation = abbreviations.find((abbr) => num >= abbr.value);

    if (abbreviation) {
      const value = num / abbreviation.value;
      // If the value has decimal places, show one decimal place, otherwise show whole number
      return value % 1 === 0
        ? `${value.toFixed(0)}${abbreviation.symbol}`
        : `${value.toFixed(1)}${abbreviation.symbol}`;
    }

    return num.toString();
  };

  // Helper function to format number with commas
  const formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-background mt-24 px-10 lg:px-20">
      <div className="max-w-[1200px] mx-auto space-y-6 pb-32">
        {/* Total Impressions Section */}
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Campaign Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Target Total Impressions
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <Input
                        value={
                          isConfirmed
                            ? formatNumberWithCommas(totalImpressions)
                            : tempTotalImpressions
                        }
                        onChange={handleTotalImpressionsChange}
                        className="bg-slate-800 text-white border-slate-700 focus:ring-sky-500"
                        disabled={isConfirmed}
                      />
                      {!isConfirmed ? (
                        <Button
                          onClick={confirmTotalImpressions}
                          className="bg-sky-600 hover:bg-sky-700 text-white"
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Button
                          onClick={resetConfirmation}
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    {inputError && (
                      <p className="text-sm text-red-400 mt-1">{inputError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Set your desired campaign impressions. This will be distrubuted
              across all ad slots.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className={`bg-slate-950 border-slate-800 ${
                !isConfirmed ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  {game.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {game.adSlots.map((slot) => (
                  <Card
                    key={slot.id}
                    className="bg-slate-900/50 border-slate-800 overflow-hidden py-0"
                  >
                    <div className="flex">
                      <div className="relative bg-slate-800 flex-shrink-0 w-[200px]">
                        {slot.imageUrl ? (
                          <Image
                            src={slot.imageUrl}
                            alt={slot.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-base font-medium text-white">
                            {slot.name}
                          </span>
                          <button
                            onClick={() => removeAdSlot(game.id, slot.id)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-slate-400">
                            <span>Impression Range</span>
                            {isConfirmed ? (
                              <span className="text-white">
                                {formatNumberWithSuffix(
                                  isDragging && activeSlotId === slot.id
                                    ? newValues[0]
                                    : isShadowActive
                                    ? shadowImpressions[slot.id]?.[0] ??
                                      slot.impressions[0]
                                    : impressionRanges[slot.id]?.[0] ??
                                      slot.impressions[0]
                                )}
                                -
                                {formatNumberWithSuffix(
                                  isDragging && activeSlotId === slot.id
                                    ? newValues[1]
                                    : isShadowActive
                                    ? shadowImpressions[slot.id]?.[1] ??
                                      slot.impressions[1]
                                    : impressionRanges[slot.id]?.[1] ??
                                      slot.impressions[1]
                                )}
                              </span>
                            ) : (
                              <span className="text-slate-500">Not set</span>
                            )}
                          </div>
                          <div className="relative">
                            {isConfirmed ? (
                              <div className="relative">
                                {/* Base layer: The original slider that stays in place */}
                                <div
                                  className={
                                    isDragging && activeSlotId === slot.id
                                      ? "block"
                                      : "hidden"
                                  }
                                >
                                  <Slider
                                    value={originalValues}
                                    min={0}
                                    max={Math.max(
                                      10,
                                      (totalImpressions /
                                        (games.flatMap((g) => g.adSlots)
                                          .length || 1)) *
                                        1.5
                                    )}
                                    step={1}
                                    disabled={true}
                                    className="w-full"
                                  />
                                </div>

                                {/* Middle layer: The moving greyed out slider (shown only when dragging) */}
                                {isDragging && activeSlotId === slot.id && (
                                  <div className="absolute inset-0 z-10">
                                    <Slider
                                      value={newValues}
                                      min={0}
                                      max={Math.max(
                                        10,
                                        (totalImpressions /
                                          (games.flatMap((g) => g.adSlots)
                                            .length || 1)) *
                                          1.5
                                      )}
                                      step={1}
                                      disabled={true}
                                      className="w-full opacity-70"
                                    />
                                  </div>
                                )}

                                {/* Top layer: The interactive slider (invisible during drag but receives events) */}
                                <div
                                  className={
                                    isDragging && activeSlotId === slot.id
                                      ? "absolute inset-0 z-20"
                                      : ""
                                  }
                                >
                                  <Slider
                                    value={
                                      isDragging && activeSlotId === slot.id
                                        ? newValues
                                        : isShadowActive
                                        ? shadowImpressions[slot.id] ||
                                          slot.impressions
                                        : impressionRanges[slot.id] ||
                                          slot.impressions
                                    }
                                    min={0}
                                    max={Math.max(
                                      10,
                                      (totalImpressions /
                                        (games.flatMap((g) => g.adSlots)
                                          .length || 1)) *
                                        1.5
                                    )}
                                    step={1}
                                    onValueChange={(value) =>
                                      handleSliderChange(
                                        slot.id,
                                        value as [number, number]
                                      )
                                    }
                                    onValueCommit={() =>
                                      handleSliderChangeEnd(slot.id)
                                    }
                                    className={
                                      isDragging && activeSlotId === slot.id
                                        ? "opacity-0"
                                        : ""
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="h-2 bg-slate-800 rounded-full w-full opacity-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog for impression changes (completely different component from Drawer/Sheet) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Update Impressions
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              How would you like to apply these changes?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center py-4">
            <Button
              variant="outline"
              className="bg-sky-600 hover:bg-sky-700 text-white border-sky-700 w-full sm:w-auto"
              onClick={applyRedistribute}
            >
              Re-distribute
            </Button>
            <Button
              className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto"
              onClick={applyIncreaseTotal}
            >
              Increase total
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 z-50">
        <div className="max-w-[1200px] mx-auto px-10 lg:px-20 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">Total Ad Slots Selected</p>
              <p className="text-xl font-bold text-white">
                {games.reduce((total, game) => total + game.adSlots.length, 0)}{" "}
                slots
              </p>
            </div>
            <div className="flex gap-4">
              {isConfirmed && isShadowActive ? (
                <>
                  <Button
                    variant="outline"
                    className="text-white border-slate-700 hover:bg-slate-800"
                    onClick={cancelShadowChanges}
                  >
                    Cancel Changes
                  </Button>
                  <Button
                    className="bg-primary-50 hover:bg-primary-50/70 text-white"
                    onClick={applyShadowChanges}
                  >
                    Apply Changes
                  </Button>
                </>
              ) : isConfirmed ? (
                <Button
                  className="bg-primary-50 hover:bg-primary-50/70 text-white"
                  onClick={startShadowMovement}
                >
                  Adjust Impressions
                </Button>
              ) : null}
              <Link href="/campaign-scheduler">
                <Button
                  className="bg-primary-50 hover:bg-primary-50/70 px-8 text-white"
                  disabled={!isConfirmed}
                >
                  Continue to Scheduler
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
