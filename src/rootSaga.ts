import { fork } from 'redux-saga/effects';
import { saga as authSaga } from 'modules/auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function* rootSaga(): IterableIterator<any> {
  yield fork(authSaga);
}
