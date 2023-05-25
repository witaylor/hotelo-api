import { Request, Response, Router } from "express";
import { rapidApiClient } from "../client/rapid-api-client";
import rapidApiCache from "../model/cache";
import { allLondonProperties } from "../model/mock-responses";
import { BasicProperty } from "../model/property";

export const index = Router();

const getPropertyDetail = async (request: Request, response: Response) => {
  try {
    // throws on not authed
    // authClient.basicAuth(request.headers.get("x-api-key"));

    const { propertyId } = request.params;

    return response.json({
      detail: await rapidApiClient.properties.detail(propertyId),
    });
  } catch (e: any) {
    return response.json({ error: e.message });
  }
};

index.get("/property-search", async (request: Request, response: Response)=> {
  return response.status(200).json({
    "properties": allLondonProperties,
  });
});

index.get("/property-detail/:propertyId", async (request: Request, response: Response)=> {
  const { propertyId } = request.params;

  const mockDetail = allLondonProperties.find((property) => property.id === propertyId);

  if (mockDetail !== undefined) {
    return response.status(200).json({ detail: mockDetail });
  }
  return getPropertyDetail(request, response);
});

index.get("/property-search-actual", async (request: Request, response: Response)=> {
  // throws on not authed
  // authClient.basicAuth(request.headers["x-api-key"]);

  const locationQuery = request.query.location;

  if (locationQuery === undefined || Array.isArray(locationQuery) ) {
    return response.status(400).json({ error: "location must be string" });
  }
  const location = locationQuery as string;

  // get closest matching location
  console.log("Searching for hotels in:", location);

  const searchLocation = await rapidApiClient.locations.search(location);
  if (searchLocation === undefined) {
    return response.status(500).json({
      error: "Could not find matching search location!",
    });
  }

  const cacheResult = rapidApiCache.getPropertyList(searchLocation.gaiaId);
  if (cacheResult && cacheResult.length > 0) {
    console.log("Property search cache hit.");
    return response.json({ properties: cacheResult });
  }
  console.log("Property search cache miss.");

  // get properties in that location
  const properties = await rapidApiClient.properties.list(
    searchLocation.gaiaId,
  );

  // map to our basic property
  const basicProperties = properties.map(
    async (property: any): Promise<BasicProperty> => {
      return {
        id: property.id,
        name: property.name,
        image:
          property.propertyImage.image ?? property.propertyImage.fallbackImage,
        price: {
          formatted: property.price.lead.formatted,
          amount: property.price.lead.amount,
        },
        reviewScore: property.reviews.score,
        loyaltyPoints: Math.floor(Math.random() * (500 - 50 + 1) + 50),
      };
    },
  );
  const allProperties = await Promise.all(basicProperties);
  rapidApiCache.setPropertyList(searchLocation.gaiaId, allProperties);

  return response.json({ properties: allProperties });
});

index.get("/property-detail-actual/:propertyId", getPropertyDetail);
