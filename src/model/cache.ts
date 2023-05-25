import { BasicProperty, PropertyDetail } from "./property";

export type CacheItem<T> = {
  expiration: Date;
  item: T;
};

class Cache {
  private propertyList: Map<string, CacheItem<BasicProperty[]>> = new Map();
  private readonly propertyDetail: Map<string, CacheItem<PropertyDetail>> =
    new Map();

  private readonly tolerance = 1_800_000; // 30 mins

  constructor() {
    console.log("Creating new cache.");
  }

  public getPropertyList(gaiaId: string): BasicProperty[] | undefined {
    const cachedSearch = this.propertyList.get(gaiaId);

    if (cachedSearch && this.isValid(cachedSearch)) {
      return cachedSearch.item;
    }
    return undefined;
  }

  public setPropertyList(gaiaId: string, list: BasicProperty[]): void {
    const searchItem: CacheItem<BasicProperty[]> = {
      expiration: new Date(),
      item: list,
    };

    this.propertyList.set(gaiaId, searchItem);
  }

  public getPropertyDetail(id: string): PropertyDetail | undefined {
    const matchedProperty =
      this.propertyDetail.get(id)?.item ??
      // else search through property list for the property
      Array.from(this.propertyList.values())
        .map(({ item }) => item)
        .flat()
        .find((property: BasicProperty) => property.id === id);

    console.log({ val: Array.from(this.propertyList.values()) });

    if (matchedProperty) {
      console.log("Property detail cache hit!");
      return matchedProperty;
    }
    return undefined;
  }

  public setPropertyDetail(detail: PropertyDetail): void {
    const detailItem: CacheItem<PropertyDetail> = {
      expiration: new Date(),
      item: detail,
    };

    this.propertyDetail.set(detail.id, detailItem);
  }

  private isValid<T>({ expiration }: CacheItem<T>): boolean {
    const now = new Date();
    return expiration.getTime() - now.getTime() <= this.tolerance;
  }
}

const rapidApiCache = new Cache();

export default rapidApiCache;
