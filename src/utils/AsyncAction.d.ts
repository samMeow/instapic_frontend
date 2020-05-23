// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestAction<T = any> = { type: string; payload: T };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuccessAction<K = any, T = any> = {
  type: string;
  payload: K;
  request: T;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FailureAction<T = any> = { type: string; error: Error; request: T };

export default class AsyncAction<T = undefined, K = undefined> {
  constructor(base: string);

  REQUEST: string;

  SUCCESS: string;

  FAILURE: string;

  request(p?: T): RequestAction<T>;

  success(data?: K, request?: T): SuccessAction<K, T>;

  failure(e: Error, request?: T): FailureAction<T>;

  toBase(): string;

  static toBase(type: string): string;

  static isRequestAction(action: Action): boolean;

  static isSuccessAction(action: Action): boolean;

  static isFailureAction(action: Action): boolean;
}
