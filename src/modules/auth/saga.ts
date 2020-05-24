import { takeEvery, call, put } from 'redux-saga/effects';

import { fetchHandler, takeOnce } from 'utils/sagaHelper';
import history from 'utils/BrowserHistory';

import loginAPI from 'api/auth/login';
import logoutAPI from 'api/auth/logout';
import signUpAPI from 'api/auth/signUp';

import {
  login,
  logout,
  signUp,
  initAuth,
  initAuthDone,
  InitAuthDone,
} from './actions';

const APP_AUTH_KEY = 'APP_AUTH';

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
    APP_AUTH_KEY,
    JSON.stringify({
      username: payload.user.username,
      token: payload.Authorization,
    }),
  );
  yield call([history, 'push'], '/posts');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* handleLogoutSuccess(): Iterator<any> {
  yield call([localStorage, 'removeItem'], APP_AUTH_KEY);
  yield call([history, 'push'], '/login');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* handleInitAuth(): Iterator<any> {
  const auth = yield call([localStorage, 'getItem'], APP_AUTH_KEY);
  if (!auth) {
    yield put(initAuthDone.do(null));
  }
  const obj = JSON.parse(String(auth)) as InitAuthDone;
  yield put(initAuthDone.do(obj));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* saga(): Iterator<any, any, any> {
  yield takeEvery(login.REQUEST, handleLogin);
  yield takeEvery(logout.REQUEST, handleLogout);
  yield takeEvery(signUp.REQUEST, handleSignUp);
  yield takeEvery(login.SUCCESS, handleLoginSuccess);
  yield takeEvery(logout.SUCCESS, handleLogoutSuccess);
  yield takeOnce(initAuth.ACTION, handleInitAuth);
}
