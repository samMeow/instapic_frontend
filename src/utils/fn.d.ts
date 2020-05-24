// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => any;
export function cacheResult<T extends Fn = Fn>(fn: T): T;

export function curryRight2<A, B, T>(
  fn: (a: A, b: B) => T,
): (b: B) => (a: A) => T;
export function curryRight2<A, B, T>(fn: (a: A, b: B) => T): (b: B, a: A) => T;
