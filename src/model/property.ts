import { Image } from "../client/types/rapid-api-client";

export type BasicProperty = {
  id: string;
  name: string;
  image?: Image;
  price?: PropertyPrice;
  reviewScore: number;
  loyaltyPoints: number;
};

export type PropertyDetail = BasicProperty & {
  description?: string;
};

export type PropertyPrice = {
  formatted: string; // e.g. "$150"
  amount: number; // e.g. 150
};
