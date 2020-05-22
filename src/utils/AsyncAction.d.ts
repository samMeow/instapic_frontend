export default class AsyncAction<T = undefined, K = undefined> {
  constructor(base: string);

  REQUEST: string;

  SUCCESS: string;

  FAILURE: string;

  request(p?: T): { type: string; payload: T };

  success(data?: K, request?: T): { type: string; payload: K; request: T };

  failure(e: Error, request?: T): { type: string; error: Error; request: T };
}
