// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => any;
export function cacheResult<T extends Fn = Fn>(fn: T): T;

type Curry1<A, T> = (a: A) => T;
type Curry2<A, B, T> = {
  (b: B): Curry1<A, T>;
  (a: A, b: B): T;
};

export function curryRight2<A, B, T>(fn: (a: A, b: B) => T): Curry2<A, B, T>;
