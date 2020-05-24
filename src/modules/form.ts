import { Action } from 'redux';
import { call, put, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import SyncAction from 'utils/SyncAction';
import APIError from 'utils/APIError';

import { signUp, login } from './auth/actions';
import { createPost, handleCreatePost } from './post';

interface FormStatus {
  success: boolean;
  errorMessage: string;
}
export interface State {
  [key: string]: FormStatus;
  signUpForm: FormStatus;
  createPostForm: FormStatus;
  loginForm: FormStatus;
}
export const INIT_STATE = {
  signUpForm: {
    success: false,
    errorMessage: '',
  },
  createPostForm: {
    success: false,
    errorMessage: '',
  },
  loginForm: {
    success: false,
    errorMessage: '',
  },
};

// ===== action =====
export const resetForm = new SyncAction<string>('RESET_FORM');
interface FormError {
  form: string;
  message: string;
}
export const setFormError = new SyncAction<FormError>('SET_FORM_ERROR');

// ===== selector =====
export const getFormSuccess = (state: { form: State }, form: string): boolean =>
  state.form[form].success;
export const getFormErrorMessage = (
  state: { form: State },
  form: string,
): string => state.form[form].errorMessage;

// ===== saga =====
export function* handleSignUpFail({
  error,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ReturnType<typeof signUp.failure>): Iterator<any> {
  let { message } = error;
  if (error instanceof APIError) {
    const text = yield call([error.response, 'text']);
    try {
      const temp = JSON.parse(String(text)) as { message: string };
      message = temp.message;
    } catch {
      message = String(text);
    }
  }
  yield put(setFormError.do({ form: 'signUpForm', message }));
}

export function* handleLoginFail({
  error,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ReturnType<typeof login.failure>): Iterator<any> {
  let { message } = error;
  if (error instanceof APIError) {
    const text = yield call([error.response, 'text']);
    try {
      const temp = JSON.parse(String(text)) as { message: string };
      message = temp.message;
    } catch {
      message = String(text);
    }
  }
  yield put(setFormError.do({ form: 'loginForm', message }));
}

export function* handleCreatePostFail({
  error,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ReturnType<typeof createPost.failure>): Iterator<any> {
  let { message } = error;
  if (error instanceof APIError) {
    const text = yield call([error.response, 'text']);
    try {
      const temp = JSON.parse(String(text)) as { message: string };
      message = temp.message;
    } catch {
      message = String(text);
    }
  }
  yield call([toast, 'error'], message);
  yield put(setFormError.do({ form: 'createPostForm', message }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* saga(): Iterator<any> {
  yield takeEvery(signUp.FAILURE, handleSignUpFail);
  yield takeEvery(login.FAILURE, handleLoginFail);
  yield takeEvery(createPost.FAILURE, handleCreatePost);
}

// ===== reducer =====
const onSignUpSuccess = (state: State): State => ({
  ...state,
  signUpForm: {
    success: true,
    errorMessage: '',
  },
});
const onCreatePostSuccess = (state: State): State => ({
  ...state,
  createPostForm: {
    success: true,
    errorMessage: '',
  },
});
const onLoginSuccess = (state: State): State => ({
  ...state,
  loginForm: {
    success: true,
    errorMessage: '',
  },
});

const onResetForm = (
  state: State,
  { payload }: ReturnType<typeof resetForm.do>,
): State => ({
  ...state,
  [payload]: {
    success: false,
    errorMessage: '',
  },
});

const onSetFormError = (
  state: State,
  { payload }: ReturnType<typeof setFormError.do>,
): State => ({
  ...state,
  [payload.form]: {
    success: false,
    errorMessage: payload.message,
  },
});

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case signUp.SUCCESS:
      return onSignUpSuccess(state);
    case createPost.SUCCESS:
      return onCreatePostSuccess(state);
    case login.SUCCESS:
      return onLoginSuccess(state);
    case resetForm.ACTION:
      return onResetForm(state, action as ReturnType<typeof resetForm.do>);
    case setFormError.ACTION:
      return onSetFormError(
        state,
        action as ReturnType<typeof setFormError.do>,
      );
    default:
      return state;
  }
}
