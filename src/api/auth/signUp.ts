import md5 from 'md5';

import FetcherFactory from 'utils/FetcherFactory';

import InstaPicFetcher from '../InstaPicFetcher';

export type SignUpResponse = {
  id: string;
  username: string;
};
const signUp = async (
  username: string,
  password: string,
): Promise<SignUpResponse> => {
  const fetcher = FetcherFactory.make(InstaPicFetcher);
  const response = await fetcher.json().post('/users', {
    username,
    password: md5(password),
  });
  const result = await response.json();
  return result;
};

export default signUp;
