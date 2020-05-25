import { Store } from 'redux';
import APIError from './APIError';

export interface FetchBuilder {
  baseURL?: string;
  headers?: { [key: string]: string };
  store?: Store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareBody?: (x: any) => any;
  timeout?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

export interface APIFetcherConstructor<T extends APIFetcher> {
  new (x: FetchBuilder): T;
}

export default class APIFetcher implements FetchBuilder {
  baseURL = '';

  headers: { [key: string]: string } = {};

  store?: Store;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  prepareBody = (x: any): any => x;

  timeout = 3000;

  constructor({
    baseURL,
    headers,
    store,
    prepareBody,
    timeout,
  }: FetchBuilder = {}) {
    this.baseURL = baseURL || this.baseURL;
    this.headers = headers || this.headers;
    this.store = store;
    this.prepareBody = prepareBody || this.prepareBody;
    this.timeout = timeout || this.timeout;
  }

  withTimeout(timeout: number): this {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor({
      ...this,
      timeout,
    });
  }

  json(): this {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor({
      ...this,
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
      prepareBody: (x: any) => JSON.stringify(x),
    });
  }

  form(): this {
    // automatic if body is form data
    delete this.headers['Content-Type'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor({
      ...this,
      headers: this.headers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
      prepareBody: (x: { [k: string]: any }) => {
        const dummy = new FormData();
        Object.entries(x)
          .filter(([, v]) => !(v instanceof File || v instanceof Blob))
          .forEach(([k, v]) => {
            dummy.append(k, v);
          });
        // files have to be at the end
        Object.entries(x)
          .filter(([, v]) => v instanceof File || v instanceof Blob)
          .forEach(([k, v]) => {
            dummy.append(k, v, v.name);
          });
        return dummy;
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request(
    method: string,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { [key: string]: any } = {},
  ): Promise<Response> {
    let query = '';
    if (method === 'GET' && Object.keys(data).length > 0)
      query = `?${new URLSearchParams(data).toString()}`;
    const url = `${this.baseURL}${path}${query}`;
    const controller = new AbortController();
    // TODO: allow outer method to have control on cancellation
    // browser specific bug upload file fail to abort
    setTimeout(() => controller.abort(), this.timeout);
    const result = await fetch(url, {
      method,
      headers: this.headers,
      ...(method !== 'GET' && { body: this.prepareBody(data) }),
      signal: controller.signal,
    });
    if (!result.ok) {
      throw new APIError('API response not ok', result);
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(path: string, param?: { [key: string]: any }): Promise<Response> {
    return this.request('GET', path, param);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post(path: string, data: { [key: string]: any }): Promise<Response> {
    return this.request('POST', path, data);
  }
}
