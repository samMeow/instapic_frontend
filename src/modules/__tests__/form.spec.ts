import { expectSaga } from 'redux-saga-test-plan';
import { toast } from 'react-toastify';
import { call } from 'redux-saga-test-plan/matchers';

import { login, signUp } from 'modules/auth/actions';
import { createPost } from 'modules/post';
import APIError from 'utils/APIError';

import reducer, {
  INIT_STATE,
  resetForm,
  setFormError,
  handleLoginFail,
  handleSignUpFail,
  handleCreatePostFail,
  getFormSuccess,
  getFormErrorMessage,
} from '../form';

describe('modules/form', () => {
  describe('reducer', () => {
    it('should handle login success correctly', () => {
      const final = reducer(INIT_STATE, login.success());
      expect(final).toMatchObject({
        loginForm: {
          success: true,
          errorMessage: '',
        },
      });
    });
    it('should handle signUp success correctly', () => {
      const final = reducer(INIT_STATE, signUp.success());
      expect(final).toMatchObject({
        signUpForm: {
          success: true,
          errorMessage: '',
        },
      });
    });
    it('should handle signUp success correctly', () => {
      const final = reducer(INIT_STATE, createPost.success());
      expect(final).toMatchObject({
        createPostForm: {
          success: true,
          errorMessage: '',
        },
      });
    });
    it('should reset Form success', () => {
      const final = reducer(INIT_STATE, resetForm.do('createPostForm'));
      expect(final).toMatchObject({
        createPostForm: {
          success: false,
          errorMessage: '',
        },
      });
    });
    it('should set Error message correctly', () => {
      const final = reducer(
        INIT_STATE,
        setFormError.do({
          form: 'loginForm',
          message: 'whatever',
        }),
      );
      expect(final).toMatchObject({
        loginForm: {
          success: false,
          errorMessage: 'whatever',
        },
      });
    });
  });

  describe('saga', () => {
    describe('handleLoginFail', () => {
      it('should handle login failure correctly', () => {
        const err = new Error('hello');
        return expectSaga(handleLoginFail, login.failure(err))
          .put(setFormError.do({ form: 'loginForm', message: 'hello' }))
          .run();
      });
      it('should handle login failure with APIError', () => {
        const err = new APIError('api', new Response('API Error'));
        return expectSaga(handleLoginFail, login.failure(err))
          .put(setFormError.do({ form: 'loginForm', message: 'API Error' }))
          .run();
      });
      it('should handle login failure with APIError json', () => {
        const err = new APIError(
          'api',
          new Response('{"message":"Json error"}'),
        );
        return expectSaga(handleLoginFail, login.failure(err))
          .put(setFormError.do({ form: 'loginForm', message: 'Json error' }))
          .run();
      });
    });

    describe('handleSignUpError', () => {
      it('should handle signUp failure correctly', () => {
        const err = new Error('hello');
        return expectSaga(handleSignUpFail, signUp.failure(err))
          .put(setFormError.do({ form: 'signUpForm', message: 'hello' }))
          .run();
      });
      it('should handle signUp failure with APIError', () => {
        const err = new APIError('api', new Response('API Error'));
        return expectSaga(handleSignUpFail, signUp.failure(err))
          .put(setFormError.do({ form: 'signUpForm', message: 'API Error' }))
          .run();
      });
      it('should handle Sign up failure with APIError json', () => {
        const err = new APIError(
          'api',
          new Response('{"message":"Json error"}'),
        );
        return expectSaga(handleSignUpFail, signUp.failure(err))
          .put(setFormError.do({ form: 'signUpForm', message: 'Json error' }))
          .run();
      });
    });
    describe('handleCreatePost', () => {
      it('should handle create Post failure correctly', () => {
        const err = new Error('hello');
        return expectSaga(handleCreatePostFail, createPost.failure(err))
          .provide([[call.fn(toast.error), null]])
          .call([toast, 'error'], 'hello')
          .put(setFormError.do({ form: 'createPostForm', message: 'hello' }))
          .run();
      });
      it('should handle signUp failure with APIError', () => {
        const err = new APIError('api', new Response('API Error'));
        return expectSaga(handleCreatePostFail, createPost.failure(err))
          .put(
            setFormError.do({ form: 'createPostForm', message: 'API Error' }),
          )
          .provide([[call.fn(toast.error), null]])
          .call([toast, 'error'], 'API Error')
          .run();
      });
      it('should handle Sign up failure with APIError json', () => {
        const err = new APIError(
          'api',
          new Response('{"message":"Json error"}'),
        );
        return expectSaga(handleCreatePostFail, createPost.failure(err))
          .put(
            setFormError.do({ form: 'createPostForm', message: 'Json error' }),
          )
          .provide([[call.fn(toast.error), null]])
          .call([toast, 'error'], 'Json error')
          .run();
      });
    });
  });

  describe('selector', () => {
    it('should getFormSuccess correctly', () => {
      const state = {
        ...INIT_STATE,
        loginForm: { success: true, errorMessage: '' },
      };
      const final = getFormSuccess({ form: state }, 'loginForm');
      expect(final).toBeTruthy();
    });
    it('should getErrorMessage correctly', () => {
      const state = {
        ...INIT_STATE,
        loginForm: { success: true, errorMessage: 'hello' },
      };
      const final = getFormErrorMessage({ form: state }, 'loginForm');
      expect(final).toEqual('hello');
    });
  });
});
