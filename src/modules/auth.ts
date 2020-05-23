import { Action } from 'redux';
import { takeEvery, call } from 'redux-saga/effects';

import AsyncAction from 'utils/AsyncAction';
import { fetchHandler } from 'utils/sagaHelper';
import history from 'utils/BrowserHistory';

import loginAPI, { LoginResponse } from 'api/auth/login';
import logoutAPI from 'api/auth/logout';
import signUpAPI, { SignUpResponse } from 'api/auth/signUp';

export interface State {
  username: string;
  token: string;
}

export const INIT_STATE: State = {
  username: '',
  token: '',
};

// ===== action =====
interface LoginRequest {
  username: string;
  password: string;
}
export const login = new AsyncAction<LoginRequest, LoginResponse>('LOGIN');
export const logout = new AsyncAction('LOGOUT');
interface SignUpRequest {
  username: string;
  password: string;
}
export const signUp = new AsyncAction<SignUpRequest, SignUpResponse>('SIGN_UP');

// ===== selector =====
export const getToken = (state: { auth: State }): string => state.auth.token;
export const isLoggedIn = (state: { auth: State }): boolean =>
  Boolean(getToken(state));

// ===== saga =====
export const handleLogin = fetchHandler(
  login,
  loginAPI,
  ({ username, password }) => [username, password],
);
export const handleLogout = fetchHandler(logout, logoutAPI);
export const handleSignUp = fetchHandler(
  signUp,
  signUpAPI,
  ({ username, password }) => [username, password],
);

export function* handleLoginSuccess({
  payload,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ReturnType<typeof login.success>): Iterator<any> {
  yield call(
    [localStorage, 'setItem'],
    'APP_AUTH',
    JSON.stringify({
      username: payload.user.username,
      token: payload.Authorization,
    }),
  );
  yield call([history, 'push'], '/posts');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* handleLogoutSuccess(): Iterator<any> {
  yield call([localStorage, 'removeItem'], 'APP_AUTH');
  yield call([history, 'push'], '/login');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* saga(): Iterator<any, any, any> {
  yield takeEvery(login.REQUEST, handleLogin);
  yield takeEvery(logout.REQUEST, handleLogout);
  yield takeEvery(signUp.REQUEST, handleSignUp);
  yield takeEvery(login.SUCCESS, handleLoginSuccess);
  yield takeEvery(logout.SUCCESS, handleLogoutSuccess);
}

// ===== reducer ====
const onLoginSuccess = (
  state: State,
  { payload }: ReturnType<typeof login.success>,
): State => ({
  ...state,
  username: payload.user.username,
  token: payload.Authorization,
});

const onLogoutSuccess = (state: State): State => ({
  ...state,
  username: '',
  token: '',
});

export default function reducer(state = INIT_STATE, action: Action): State {
  switch (action.type) {
    case login.SUCCESS:
      return onLoginSuccess(state, action as ReturnType<typeof login.success>);
    case logout.SUCCESS:
      return onLogoutSuccess(state);
    default:
      return state;
  }
}
