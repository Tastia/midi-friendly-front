import { Organization } from "./organization";
import { User } from "./user";

export type Restaurant = {
  _id: string;
  name: string;
  placeId: string;
  website: string;
  phoneNumber: string;
  organization: Organization;
  photos: Array<{
    url: string;
    reference: string;
    width: string;
    height: string;
  }>;
  priceLevel: number;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  openingHours: string[];
  reviews: {
    google: Array<{
      authorName: string;
      authorPhoto: string;
      rating: string;
      text: string;
      createdAt: string;
    }>;
    internal: Array<{
      user: User;
      rating: number;
      text?: string;
    }>;
  };
  services: {
    delivery: boolean;
    takeout: boolean;
    dineIn: boolean;
    wine: boolean;
    beer: boolean;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    reservable: boolean;
    vegetarian: boolean;
  };
  types: string[];
};
