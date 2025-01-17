import { Store } from 'redux';

import APIFetcher, { APIFetcherConstructor } from './APIFetcher';

class FetcherFactory {
  store?: Store;

  dict = new WeakMap<APIFetcherConstructor<APIFetcher>, APIFetcher>();

  bindStore(store: Store): void {
    this.store = store;
  }

  make<T extends APIFetcher>(Ins: APIFetcherConstructor<T>): T {
    if (!(Ins.prototype instanceof APIFetcher)) {
      throw new Error("Can't construct non APIFetcher instances");
    }
    const fetcher = this.dict.get(Ins) as T;
    if (fetcher) return fetcher;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const f = new Ins({ store: this.store! });
    this.dict.set(Ins, f);
    return f;
  }
}

// singleton
export default new FetcherFactory();
