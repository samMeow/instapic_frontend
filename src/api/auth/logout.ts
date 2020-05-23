import FetcherFactory from 'utils/FetcherFactory';

import InstaPicFetcher from '../InstaPicFetcher';

const logout = async (): Promise<void> => {
  const fetcher = FetcherFactory.make(InstaPicFetcher);
  await fetcher.withAuth().json().post('/auth/logout', {});
};

export default logout;
