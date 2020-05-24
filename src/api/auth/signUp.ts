import md5 from 'md5';

import FetcherFactory from 'utils/FetcherFactory';

import AuthFetcher from '../AuthFetcher';

export type SignUpResponse = {
  id: string;
  username: string;
};
const signUp = async (
  username: string,
  password: string,
): Promise<SignUpResponse> => {
  const fetcher = FetcherFactory.make(AuthFetcher);
  const response = await fetcher.json().post('/users', {
    username,
    password: md5(password),
  });
  const result = await response.json();
  return result;
};

export default signUp;
