export const cacheResult = (fn) => {
  let last;
  return function cached(...args) {
    const result = fn(...args);
    if (JSON.stringify(result) === JSON.stringify(last)) return last;
    last = result;
    return last;
  };
};

export function curryRight2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return (_b) => fn(_b, a);
      default:
        return fn(b, a);
    }
  };
}
