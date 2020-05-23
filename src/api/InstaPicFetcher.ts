import { toast } from 'react-toastify';

import APIFetcher from 'utils/APIFetcher';
import { getToken, logout } from 'modules/auth';

const { REACT_APP_INSTAPIC_API_URL } = process.env;

export default class InstaPicFetcher extends APIFetcher {
  baseURL = REACT_APP_INSTAPIC_API_URL || '';

  withAuth = (): this =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new this.constructor({
      ...this,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${getToken(this.store?.getState())}`,
      },
    });

  async request(
    method: string,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { [key: string]: any } = {},
  ): Promise<Response> {
    try {
      const result = await super.request(method, path, data);
      return result;
    } catch (e) {
      if (e instanceof Response) {
        if (e.status === 401 && this.headers.Authorization) {
          // TODO: should show session expired modal
          toast.error('Please login to continue this action');
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.store!.dispatch(logout.request());
        }
      }
      throw e;
    }
  }
}
