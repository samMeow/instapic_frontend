import { State } from './reducer';

export const getToken = (state: { auth: State }): string => state.auth.token;
export const isLoggedIn = (state: { auth: State }): boolean =>
  Boolean(getToken(state));
export const isAuthInited = (state: { auth: State }): boolean =>
  state.auth.initAuth;
