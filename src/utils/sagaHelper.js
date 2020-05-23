import { call, put, fork, take } from 'redux-saga/effects';

const toArgs = (x) => [x];

export function fetchHandler(action, api, transform = toArgs) {
  return function* handleFetchTask({ payload }) {
    try {
      const response = yield call(api, ...transform(payload));
      yield put(action.success(response, payload));
    } catch (e) {
      yield put(action.failure(e, payload));
    }
  };
}

export function* once(pattern, handler) {
  const p = yield take(pattern);
  yield fork(handler, p);
}

export function takeOnce(pattern, handler) {
  return fork(once, pattern, handler);
}
