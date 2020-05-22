import APIFetcher, { APIFetcherConstructor } from './APIFetcher';

class FetcherFactory {
  dict = new WeakMap<APIFetcherConstructor<APIFetcher>, APIFetcher>();

  make<T extends APIFetcher>(Ins: APIFetcherConstructor<T>): T {
    if (!(Ins.prototype instanceof APIFetcher)) {
      throw new Error("Can't construct non APIFetcher instances");
    }
    const fetcher = this.dict.get(Ins) as T;
    if (fetcher) return fetcher;
    const f = new Ins({});
    this.dict.set(Ins, f);
    return f;
  }
}

// singleton
export default new FetcherFactory();
