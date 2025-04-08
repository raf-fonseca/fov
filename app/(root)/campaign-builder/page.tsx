"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";

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

  // Store impression ranges separately from the game data
  const [impressionRanges, setImpressionRanges] = useState<
    Record<string, [number, number]>
  >({});

  const updateSlotImpressions = (slotId: string, value: [number, number]) => {
    setImpressionRanges((prev) => ({
      ...prev,
      [slotId]: value,
    }));
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
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="bg-slate-950 border-slate-800">
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
                            <span>
                              {(
                                impressionRanges[slot.id]?.[0] ??
                                slot.impressions[0]
                              ).toFixed(1)}
                              M -
                              {(
                                impressionRanges[slot.id]?.[1] ??
                                slot.impressions[1]
                              ).toFixed(1)}
                              M
                            </span>
                          </div>
                          <Slider
                            defaultValue={[
                              slot.impressions[0],
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
    </div>
  );
}
