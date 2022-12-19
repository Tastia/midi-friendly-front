import { Organization } from "./organization";
import { User } from "./user";

export type Restaurant = {
  _id: string;
  name: string;
  organization: Organization;
  photos: Array<{ reference: string; width: string; height: string }>;
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
};
