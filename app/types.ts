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
export type CalendarView = "day" | "week" | "month";

export type GameInfo = {
  id: string;
  name: string;
  type: string;
  platforms: string[];
  monthlyImpressions: string;
  monthlyPlayers: string;
  demographics: {
    ageRange: string;
    regions: string[];
  };
  dailyImpressions: number;
  thumbnailUrl: string;
  color: string;
  platformDistribution: {
    platform: string;
    percentage: number;
  }[];
};
