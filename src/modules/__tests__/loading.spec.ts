import AsyncAction from 'utils/AsyncAction';

import reducer, { getLoading } from '../loading';

describe('modules/loading', () => {
  describe('reducer', () => {
    const dummyAction = new AsyncAction<string>('DUMMY');
    it('should set loading when request', () => {
      const final = reducer({}, dummyAction.request('hi'));
      expect(final).toMatchObject({
        DUMMY: { loading: true },
        'DUMMY"hi"': { loading: true },
      });
    });

    it('should mark loading false when success', () => {
      const final = reducer(
        {
          DUMMY: { loading: true },
          'DUMMY"hi"': { loading: true },
        },
        dummyAction.success(undefined, 'hi'),
      );
      expect(final).toMatchObject({
        DUMMY: { loading: false },
        'DUMMY"hi"': { loading: false },
      });
    });

    it('should mark loading false when failure', () => {
      const final = reducer(
        {
          DUMMY: { loading: true },
          'DUMMY"hi"': { loading: true },
        },
        dummyAction.failure(new Error('whatever'), 'hi'),
      );
      expect(final).toMatchObject({
        DUMMY: { loading: false },
        'DUMMY"hi"': { loading: false },
      });
    });
  });

  describe('selector', () => {
    const dummyAction = new AsyncAction<string>('DUMMY');
    it('should getLoading correctly', () => {
      const state = {
        loading: {
          DUMMY: { loading: true },
          'DUMMY"hi"': { loading: true },
        },
      };
      expect(getLoading(state, dummyAction, 'hi')).toBeTruthy();
    });
    it('should return false if not exists', () => {
      const state = { loading: {} };
      expect(getLoading(state, dummyAction)).toBeFalsy();
    });
  });
});
