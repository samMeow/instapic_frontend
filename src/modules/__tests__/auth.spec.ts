import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import history from 'utils/BrowserHistory';
import loginAPI from 'api/auth/login';
import signUpAPI from 'api/auth/signUp';

import reducer, { INIT_STATE } from '../auth/reducer';
import { login, logout, signUp, initAuthDone } from '../auth/actions';
import {
  saga,
  handleLoginSuccess,
  handleLogoutSuccess,
  handleLogin,
  handleSignUp,
  handleInitAuth,
} from '../auth/saga';
import { isLoggedIn } from '../auth/selectors';

describe('modules/auth', () => {
  describe('reducer', () => {
    it('set tokens when logged in', () => {
      const result = reducer(
        INIT_STATE,
        login.success({
          status: '',
          message: '',
          Authorization: 'token',
          user: {
            id: 1,
            username: 'temp',
          },
        }),
      );
      expect(result).toMatchObject({ token: 'token', username: 'temp' });
    });

    it('should set tokens to empty when logout', () => {
      const result = reducer(INIT_STATE, logout.success());
      expect(result).toMatchObject({ token: '', username: '' });
    });

    it('should dehydarate state when initAuth success', () => {
      const result = reducer(
        INIT_STATE,
        initAuthDone.do({ username: '123', token: 'abc' }),
      );
      expect(result).toMatchObject({
        username: '123',
        token: 'abc',
        initAuth: true,
      });
    });

    it('should mark initAuth done even not exists', () => {
      const result = reducer(INIT_STATE, initAuthDone.do(null));
      expect(result).toMatchObject({
        initAuth: true,
      });
    });
  });

  describe('saga', () => {
    it('should run without blocking', () => {
      return expectSaga(saga)
        .returns(undefined)
        .run({ timeout: 5, silenceTimeout: true });
    });

    it('should handle login Success correctly', () => {
      const response = {
        status: '',
        message: '',
        Authorization: 'token',
        user: {
          id: 1,
          username: 'temp',
        },
      };
      return expectSaga(handleLoginSuccess, login.success(response))
        .provide([
          [call.fn(localStorage.setItem), null],
          [call.fn(history.push), null],
        ])
        .call(
          [localStorage, 'setItem'],
          'APP_AUTH',
          '{"username":"temp","token":"token"}',
        )
        .call([history, 'push'], '/posts')
        .run();
    });

    it('should handle logout Success correctly', () => {
      return expectSaga(handleLogoutSuccess)
        .provide([
          [call.fn(localStorage.removeItem), null],
          [call.fn(history.push), null],
        ])
        .call([localStorage, 'removeItem'], 'APP_AUTH')
        .call([history, 'push'], '/login')
        .run();
    });

    it('should transform handleLogin fetch correctly', () => {
      return expectSaga(
        handleLogin,
        login.request({ username: '123', password: 'abc' }),
      )
        .provide([[call.fn(loginAPI), {}]])
        .call(loginAPI, '123', 'abc')
        .run();
    });

    it('should transform handleSignUp fetch correctly', () => {
      return expectSaga(
        handleSignUp,
        signUp.request({ username: '123', password: 'abc' }),
      )
        .provide([[call.fn(signUpAPI), {}]])
        .call(signUpAPI, '123', 'abc')
        .run();
    });

    describe('handleInitAuth', () => {
      it('should initAuth with token when local exits', () => {
        return expectSaga(handleInitAuth)
          .provide([
            [call.fn(localStorage.getItem), '{"username":"123","token":"abc"}'],
          ])
          .put(initAuthDone.do({ username: '123', token: 'abc' }))
          .run();
      });

      it('should return null when local not exists', () => {
        return expectSaga(handleInitAuth)
          .provide([[call.fn(localStorage.getItem), null]])
          .put(initAuthDone.do(null))
          .run();
      });
    });
  });

  describe('selector', () => {
    it('should be logged in if token not empty', () => {
      const loggedIn = isLoggedIn({ auth: { ...INIT_STATE, token: '123' } });
      expect(loggedIn).toBeTruthy();
    });
  });
});
