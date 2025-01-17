import md5 from 'md5';

import FetcherFactory from 'utils/FetcherFactory';

import AuthFetcher from '../AuthFetcher';

export type LoginResponse = {
  status: string;
  message: string;
  Authorization: string;
  user: {
    id: number;
    username: string;
  };
};
const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const fetcher = FetcherFactory.make(AuthFetcher);
  const response = await fetcher.json().post('/auth/login', {
    username,
    password: md5(password),
  });
  const result = await response.json();
  return result;
};

export default login;
