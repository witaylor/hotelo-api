import axios from "axios";
import rapidApiCache from "../model/cache";
import { PropertyDetail } from "../model/property";
import { GaiaRegionResult, Property } from "./types/rapid-api-client";

const baseUrl = "https://hotels4.p.rapidapi.com";
const commonHeaders = () => ({
  "content-type": "application/json",
  "X-RapidAPI-Key": process.env.RAPID_API_KEY,
  "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
});
const siteId = "300000001";

export const rapidApiClient = {
  locations: {
    search: async (query: string) => {
      const options = {
        method: "GET",
        url: `${baseUrl}/locations/v3/search`,
        params: {
          q: query,
          locale: "en_US",
          langid: "1033",
          siteid: siteId,
        },
        headers: {
          ...commonHeaders(),
        },
      };

      console.log({ options });

      try {
        const { data } = await axios.request(options);

        const searchRegions = data.sr as GaiaRegionResult[];
        const firstRegion = searchRegions.shift();

        console.log(`Matched ${searchRegions.length} regions.`);
        console.log(`Taking ${firstRegion?.gaiaId}`);

        //? do we always want to take the first one?
        return firstRegion;
      } catch (error) {
        console.error("Error searching locations:", error);
      }
    },
  },

  properties: {
    list: async (regionId: string, limit = 20): Promise<Property[]> => {
      const options = {
        method: "POST",
        url: `${baseUrl  }/properties/v2/list`,
        headers: commonHeaders(),
        data: {
          currency: "USD",
          eapid: 1,
          locale: "en_US",
          siteId: 300000001,
          destination: { regionId: "2114" },
          checkInDate: {
            day: 10,
            month: 10,
            year: 2022,
          },
          checkOutDate: {
            day: 15,
            month: 10,
            year: 2022,
          },
          rooms: [{ adults: 2 }],
          resultsStartingIndex: 0,
          resultsSize: limit,
        },
      };

      try {
        console.log("Searching for properties in region ", { regionId });
        const response = await axios.request(options);

        const properties = response.data.data.propertySearch
          .properties as Property[];
        console.log(`Fetched ${properties.length} properties.`);

        return properties ?? [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    detail: async (propertyId: string): Promise<PropertyDetail | undefined> => {
      const options = {
        method: "POST",
        url: "https://hotels4.p.rapidapi.com/properties/v2/detail",
        headers: commonHeaders(),
        data: {
          currency: "USD",
          eapid: 1,
          locale: "en_US",
          siteId: 300000001,
          propertyId,
        },
      };

      try {
        const { data } = await axios.request(options);
        const {
          summary,
          propertyGallery,
          reviewInfo,
          propertyContentSectionGroups,
        } = data.data.propertyInfo;

        const cachedProperty = rapidApiCache.getPropertyDetail(propertyId);

        const detail = {
          id: cachedProperty?.id ?? summary.id,
          name: cachedProperty?.name ?? summary.name,
          image:
            cachedProperty?.image ?? propertyGallery?.images?.shift()?.image,
          price: cachedProperty?.price ?? undefined,
          reviewScore:
            cachedProperty?.reviewScore ??
            reviewInfo?.summary?.overallScoreWithDescriptionA11y?.value ??
            0,
          loyaltyPoints:
            cachedProperty?.loyaltyPoints ??
            Math.floor(Math.random() * (500 - 50 + 1) + 50),
          description:
            cachedProperty?.description ??
            propertyContentSectionGroups.aboutThisProperty.sections
              .find((section: any) => {
                return section.header.text === "About this property";
              })
              .bodySubSections.shift()
              ?.elements.shift()
              ?.items.shift()?.content?.text ??
            "",
        };

        rapidApiCache.setPropertyDetail(detail);

        return detail;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
    description: async (propertyId: string): Promise<string | undefined> => {
      const options = {
        method: "POST",
        url: "https://hotels4.p.rapidapi.com/properties/v2/get-content",
        headers: commonHeaders(),
        data: {
          currency: "USD",
          eapid: 1,
          locale: "en_US",
          siteId: 300000001,
          propertyId: propertyId,
        },
      };

      try {
        const { data } = await axios.request(options);

        return data.data.propertyInfo.propertyContentSectionGroups.aboutThisProperty.sections
          .find((section: any) => {
            return section.header.text === "About this property";
          })
          .bodySubSections.shift()
          ?.elements.shift()
          ?.items.shift()?.content?.text;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  },
};
