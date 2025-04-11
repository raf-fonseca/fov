"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, ImageIcon, ArrowRight, Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
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
  impressions: number; // Single value instead of range
  imageUrl?: string;
}

interface Game {
  id: string;
  name: string;
  adSlots: AdSlot[];
}

export default function CampaignBuilder() {
  const [games, setGames] = useState<Game[]>([
    {
      id: "crazy-rvb",
      name: "Crazy RVB",
      adSlots: [
        {
          id: "slot1",
          name: "South Billboard",
          impressions: 1.5,
          imageUrl: "/billboard1.png",
        },
        {
          id: "slot2",
          name: "Center Billboard",
          impressions: 1.0,
          imageUrl: "/billboard2.png",
        },
        {
          id: "slot3",
          name: "North Billboard",
          impressions: 2.0,
          imageUrl: "/billboard3.png",
        },
      ],
    },
  ]);

  const [impressionValues, setImpressionValues] = useState<
    Record<string, number>
  >({});
  const [totalImpressions, setTotalImpressions] = useState<number>(0);
  const [minimumGuaranteed, setMinimumGuaranteed] = useState<number>(0);
  const [inputError, setInputError] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [tempTotalImpressions, setTempTotalImpressions] = useState<string>("");

  // Dialog-specific state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [originalValue, setOriginalValue] = useState<number>(0);
  const [newValue, setNewValue] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Calculate minimum guaranteed impressions based on selected slots
  useEffect(() => {
    const totalMin = games.reduce((sum, game) => {
      return (
        sum +
        game.adSlots.reduce((gameSum, slot) => {
          const value = impressionValues[slot.id] || slot.impressions;
          return gameSum + value;
        }, 0)
      );
    }, 0);
    setMinimumGuaranteed(totalMin);
  }, [games, impressionValues]);

  // Distribute impressions when confirmed
  const distributeImpressions = (total: number) => {
    // Count total slots
    const allSlots = games.flatMap((game) => game.adSlots);
    const slotCount = allSlots.length;

    if (slotCount === 0) return;

    // Calculate even distribution
    const impressionsPerSlot = total / slotCount;

    // Create new impression values
    const newValues: Record<string, number> = {};

    allSlots.forEach((slot) => {
      newValues[slot.id] = impressionsPerSlot;
    });

    // Update the impression values
    setImpressionValues(newValues);
  };

  const updateSlotImpressions = (slotId: string, value: number) => {
    setImpressionValues((prev) => ({
      ...prev,
      [slotId]: value,
    }));
  };

  const handleTotalImpressionsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/,/g, "");

    if (rawValue === "") {
      setTempTotalImpressions("");
      setInputError("");
      return;
    }

    const numValue = parseFloat(rawValue);

    if (isNaN(numValue)) {
      setTempTotalImpressions(rawValue);
      setInputError("");
    } else {
      setTempTotalImpressions(formatNumberWithCommas(numValue));
      setInputError("");
    }
  };

  const confirmTotalImpressions = () => {
    if (tempTotalImpressions === "") {
      setInputError("Please enter a value");
      return;
    }

    const numValue = parseFloat(tempTotalImpressions.replace(/,/g, ""));

    if (isNaN(numValue)) {
      setInputError("Please enter a valid number");
      return;
    }

    if (numValue < 1000000) {
      setInputError(
        "Ad slots combined generate a minimum of 1 million impressions per day. Please increase the total impressions."
      );
      return;
    }

    setTotalImpressions(numValue);
    setInputError("");
    setIsConfirmed(true);
    distributeImpressions(numValue);
  };

  const resetConfirmation = () => {
    setIsConfirmed(false);
    setTempTotalImpressions(totalImpressions.toString());
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
  const handleSliderChange = (slotId: string, value: number) => {
    if (!isDragging) {
      setIsDragging(true);
      setActiveSlotId(slotId);
      setOriginalValue(
        impressionValues[slotId] ||
          games.flatMap((g) => g.adSlots).find((s) => s.id === slotId)
            ?.impressions ||
          0
      );
    }
    setNewValue(value);
  };

  const handleSliderChangeEnd = (slotId: string) => {
    if (isDragging) {
      setIsDragging(false);
      setDialogOpen(true);
    }
  };

  // Dialog action handlers
  const applyRedistribute = () => {
    if (activeSlotId) {
      // Store current values for potential undo
      const currentValues = { ...impressionValues };

      // Calculate the difference between new and original value
      const diff = newValue - originalValue;

      // Get all slots except the one being changed
      const otherSlots = games
        .flatMap((game) => game.adSlots)
        .filter((slot) => slot.id !== activeSlotId);

      // Calculate how much to adjust each other slot
      const amountToAdjust = -diff / (otherSlots.length || 1);

      // Create new impression values
      const newValues: Record<string, number> = {};

      // Update all slots
      games.forEach((game) => {
        game.adSlots.forEach((slot) => {
          if (slot.id === activeSlotId) {
            newValues[slot.id] = newValue;
          } else {
            const currentValue = impressionValues[slot.id] ?? slot.impressions;
            newValues[slot.id] = Math.max(0, currentValue + amountToAdjust);
          }
        });
      });

      // Update the impression values
      setImpressionValues(newValues);

      // Show toast with undo option
      toast.success(
        (t) => (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImpressionValues(currentValues);
                  toast.dismiss(t.id);
                }}
                className="text-sky-400 hover:text-sky-300 p-1 hover:bg-slate-700 rounded"
              >
                <Undo2 size={16} />
              </button>
              <span>Impressions successfully re-distributed</span>
            </div>
          </div>
        ),
        {
          duration: 3000,
        }
      );
    }
    handleDialogClose();
  };

  const applyIncreaseTotal = () => {
    const diff = newValue - originalValue;
    const newTotal = Math.round(totalImpressions + diff);
    setTotalImpressions(newTotal);
    setTempTotalImpressions(formatNumberWithCommas(newTotal));

    // Redistribute impressions based on the new total
    distributeImpressions(newTotal);

    // Show toast with the new total
    toast.success(
      (t) => (
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTotalImpressions(totalImpressions);
                setTempTotalImpressions(
                  formatNumberWithCommas(totalImpressions)
                );
                distributeImpressions(totalImpressions);
                toast.dismiss(t.id);
              }}
              className="text-sky-400 hover:text-sky-300 p-1 hover:bg-slate-700 rounded"
            >
              <Undo2 size={16} />
            </button>
            <span>
              Total impressions updated to {formatNumberWithSuffix(newTotal)}
            </span>
          </div>
        </div>
      ),
      {
        duration: 3000,
      }
    );

    handleDialogClose();
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
              Set your desired campaign impressions. This will be distributed
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
                            <span>Impressions</span>
                            {isConfirmed ? (
                              <span className="text-white">
                                {formatNumberWithSuffix(
                                  isDragging && activeSlotId === slot.id
                                    ? newValue
                                    : impressionValues[slot.id] ??
                                        slot.impressions
                                )}
                              </span>
                            ) : (
                              <span className="text-slate-500">Not set</span>
                            )}
                          </div>
                          {isConfirmed ? (
                            <div className="relative w-full">
                              {/* Interactive slider */}
                              <div className="relative w-full">
                                <Slider
                                  value={[
                                    isDragging && activeSlotId === slot.id
                                      ? newValue
                                      : impressionValues[slot.id] ??
                                        slot.impressions,
                                  ]}
                                  min={0}
                                  max={Math.max(
                                    10,
                                    (totalImpressions /
                                      (games.flatMap((g) => g.adSlots).length ||
                                        1)) *
                                      1.5
                                  )}
                                  step={0.1}
                                  onValueChange={(value) =>
                                    handleSliderChange(slot.id, value[0])
                                  }
                                  onValueCommit={() =>
                                    handleSliderChangeEnd(slot.id)
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
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog for impression changes */}
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
