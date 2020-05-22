/* eslint max-classes-per-file: 0 */
import FetcherFactory from '../FetcherFactory';
import Fetcher from '../APIFetcher';

describe('FetcherFactory', () => {
  it('should throw error for making non Fetcher', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      FetcherFactory.make('error');
    }).toThrow("Can't construct non APIFetcher instances");
  });
  it('should return instance of given constructor', () => {
    class TestFetcher extends Fetcher {}
    const fet = FetcherFactory.make(TestFetcher);
    expect(fet).toBeInstanceOf(TestFetcher);
  });
  it('should return the same instance for same constructor', () => {
    class DummyFetcher extends Fetcher {}
    const fet1 = FetcherFactory.make(DummyFetcher);
    const fet2 = FetcherFactory.make(DummyFetcher);
    expect(fet1).toEqual(fet2);
  });
});
