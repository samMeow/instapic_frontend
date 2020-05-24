import { cacheResult, curryRight2 } from '../fn';

describe('utils/fn', () => {
  describe('for cacheResult', () => {
    const complexFn = cacheResult((a, b) => ({ a, b }));
    it('should return same result if result same', () => {
      const result = complexFn(1, 2);
      expect(complexFn(1, 2)).toEqual(result);
    });
    it('should return different result for different param', () => {
      const result = complexFn(3, 4);
      expect(complexFn(5, 6)).not.toEqual(result);
    });
  });

  describe('curryRight2', () => {
    const dummy = curryRight2((a: number, b: number) => [a, b]);
    it('should reverse calling order when normal call', () => {
      const result = dummy(1, 2);
      expect(result).toMatchObject([2, 1]);
    });
    it('should able to curry', () => {
      const result = dummy(1)(2);
      expect(result).toMatchObject([2, 1]);
    });
  });
});
