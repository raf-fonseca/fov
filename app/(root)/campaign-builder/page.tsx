"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, ImageIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

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
    const value = e.target.value;
    setTempTotalImpressions(value);

    // Validation happens during input as well
    if (value === "") {
      setInputError("");
      return;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setInputError("Please enter a valid number");
    } else if (numValue < 1000000) {
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

    setTotalImpressions(numValue);
    setInputError("");
    setIsConfirmed(true);
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
                        step="0.1"
                        value={
                          isConfirmed
                            ? totalImpressions || ""
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
                            <span>Impression Range (Millions)</span>
                            <span className="text-white">
                              {(isShadowActive
                                ? shadowImpressions[slot.id]?.[0] ??
                                  slot.impressions[0]
                                : impressionRanges[slot.id]?.[0] ??
                                  slot.impressions[0]
                              ).toFixed(1)}
                              M -
                              {(isShadowActive
                                ? shadowImpressions[slot.id]?.[1] ??
                                  slot.impressions[1]
                                : impressionRanges[slot.id]?.[1] ??
                                  slot.impressions[1]
                              ).toFixed(1)}
                              M
                            </span>
                          </div>
                          <Slider
                            defaultValue={[
                              isShadowActive
                                ? shadowImpressions[slot.id]?.[0] ??
                                  slot.impressions[0]
                                : impressionRanges[slot.id]?.[0] ??
                                  slot.impressions[0],
                              isShadowActive
                                ? shadowImpressions[slot.id]?.[1] ??
                                  slot.impressions[1]
                                : impressionRanges[slot.id]?.[1] ??
                                  slot.impressions[1],
                            ]}
                            min={0}
                            max={10}
                            step={0.1}
                            onValueChange={(value) =>
                              updateSlotImpressions(
                                slot.id,
                                value as [number, number]
                              )
                            }
                            className="w-full"
                          />
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
