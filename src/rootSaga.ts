import { fork } from 'redux-saga/effects';
import { saga as authSaga } from 'modules/auth/saga';
import { saga as postSaga } from 'modules/post';
import { saga as formSaga } from 'modules/form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function* rootSaga(): IterableIterator<any> {
  yield fork(authSaga);
  yield fork(formSaga);
  yield fork(postSaga);
}
