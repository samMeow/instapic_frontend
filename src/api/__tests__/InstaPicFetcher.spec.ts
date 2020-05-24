import { createStore } from 'redux';

import * as selector from 'modules/auth/selectors';
import * as auth from 'modules/auth/actions';

import APIFetcher from 'utils/APIFetcher';
import APIError from 'utils/APIError';

import InstaPicFetcher from '../InstaPicFetcher';

describe('OnlineAPIFetcher', () => {
  const dummyStore = {
    ...createStore(() => ({}), {}),
    getState: () => ({}),
    dispatch: jest.fn(),
  };
  it('should include authorization token from store for withAuth', () => {
    const fetcher = new InstaPicFetcher({ store: dummyStore });
    const temp = jest.spyOn(selector, 'getToken').mockReturnValue('token');
    expect(fetcher.withAuth().headers).toMatchObject({
      Authorization: 'Bearer token',
    });
    temp.mockRestore();
  });
  it('should return normally when request called success', async () => {
    const dummyResponse = new Response('hello');
    const fetcher = new InstaPicFetcher({});
    const temp = jest
      .spyOn(APIFetcher.prototype, 'request')
      .mockResolvedValue(dummyResponse);
    await expect(fetcher.request('GET', '')).resolves.toEqual(dummyResponse);
    temp.mockRestore();
  });
  it('should call logout if response is 401', async () => {
    const dummyResponse = new Response('Not authorized', { status: 401 });
    const err = new APIError('error', dummyResponse);
    const fetcher = new InstaPicFetcher({ store: dummyStore });
    const temp = jest
      .spyOn(APIFetcher.prototype, 'request')
      .mockRejectedValue(err);
    const select = jest.spyOn(selector, 'getToken').mockReturnValue('token');

    await expect(fetcher.withAuth().request('GET', '')).rejects.toEqual(err);
    expect(dummyStore.dispatch).toBeCalledWith(auth.logout.request());
    temp.mockRestore();
    select.mockRestore();
  });
});
