import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import AsyncAction from 'utils/AsyncAction';
import { fetchHandler, once } from '../sagaHelper';

describe('sagaHelper', () => {
  describe('for fetchHandler', () => {
    const dummyAction = new AsyncAction<string, string>('DUMMY');
    const dummyAPI = <T>(x: T): Promise<T> => Promise.resolve(x);
    it('should pass success flow', () => {
      const handler = fetchHandler(dummyAction, dummyAPI);
      return expectSaga(handler, dummyAction.request('1'))
        .provide([[call.fn(dummyAPI), 'whatever']])
        .put(dummyAction.success('whatever', '1'))
        .run();
    });
    it('should pass error flow', () => {
      const err = new Error('err');
      const handler = fetchHandler(dummyAction, dummyAPI);
      return expectSaga(handler, dummyAction.request('1'))
        .provide([[call.fn(dummyAPI), throwError(err)]])
        .put(dummyAction.failure(err, '1'))
        .run();
    });
    it('should transform args correctly', () => {
      const fancyAPI = (
        a: number,
        b: number,
        c: number,
      ): Promise<{ a: number; b: number; c: number }> =>
        Promise.resolve({ a, b, c });
      const fancyAction = new AsyncAction<
        { a: number; b: number; c: number },
        { a: number; b: number; c: number }
      >('FANCY');
      const handler = fetchHandler(fancyAction, fancyAPI, ({ a, b, c }) => [
        c,
        b,
        a,
      ]);
      return expectSaga(handler, fancyAction.request({ a: 1, b: 2, c: 3 }))
        .provide([[call.fn(fancyAPI), { a: 3, b: 2, c: 1 }]])
        .call(fancyAPI, 3, 2, 1)
        .put(fancyAction.success({ a: 3, b: 2, c: 1 }, { a: 1, b: 2, c: 3 }))
        .run();
    });
  });

  describe('for once', () => {
    it('should fork task once then done', () => {
      const dummy = function* dummy(): Iterator<null> {
        yield null;
      };
      const action = { type: 'WHAT', payload: 'null' };
      return expectSaga(once, 'WHAT', dummy)
        .dispatch(action)
        .fork(dummy, action)
        .run();
    });
  });
});
