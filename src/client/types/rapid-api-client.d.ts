export type GaiaRegionResult = {
  "@type": "gaiaRegionresult";
  index: string;
  gaiaId: string;
  type: string;
  regionNames: GaiaRegionNames;
  essId: unknown;
  coordinates: any;
  hierarchyInfo: unknown;
};

export type GaiaRegionNames = {
  fullName: string;
  shortName: string;
  displayName: string;
  primaryDisplayName: string;
  secondaryDisplayName: string;
  lastSearchName: string;
};

export type Property = {
  __typename: "Property";
  id: string;
  featuredMessages: unknown;
  name: string;
  availability: unknown;
  propertyImage: propertyImage;
  destinationInfo: unknown;
  legalDisclaimer: unknown;
  listingFooter: unknown;
  mapMarker: unknown;
  neighborhood: unknown;
  offerBadge: unknown;
  offerSummary: unknown;
  pinnedDetails: unknown;
  price: PropertyPrice;
  priceAfterLoyaltyPointsApplied: unknown;
  propertyFees: unknown;
  reviews: PropertyReview;
  sponsoredListing: unknown;
  star: unknown;
  supportingMessages: unknown;
  regionId: string;
  priceMetadata: unknown;
  saveTripItem: unknown;
};

export type propertyImage = {
  __typename: "PropertyImage";
  alt: string;
  fallbackImage?: Image;
  image?: Image;
  subjectId: number;
};

export type Image = {
  __typename: "Image";
  description?: string;
  url: string;
};

export type PropertyPrice = {
  __typename: "PropertyPrice";
  options: unknown;
  priceMessaging: null;
  lead: Money;
  strikeOut: unknown;
  displayMessages: unknown;
  strikeOutType: string;
  priceMessages: unknown;
};

export type Money = {
  __typename: "Money";
  amount: number;
  currencyInfo: Currency;
  formatted: string;
};

export type Currency = {
  __typename: "Currency";
  code: string;
  symbol: string;
};

export type PropertyReview = {
  __typename: "PropertyReviewsSummary";
  score: number;
  total: number;
};
