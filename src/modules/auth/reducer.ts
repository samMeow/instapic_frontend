import { Action } from 'redux';

import { login, logout, initAuthDone } from './actions';

export interface State {
  username: string;
  token: string;
  initAuth: boolean;
}

export const INIT_STATE: State = {
  username: '',
  token: '',
  initAuth: false,
};

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

const onInitAuthDone = (
  state: State,
  { payload }: ReturnType<typeof initAuthDone.do>,
): State => ({
  ...state,
  initAuth: true,
  ...(payload && {
    username: payload.username,
    token: payload.token,
  }),
});

export default function reducer(state = INIT_STATE, action: Action): State {
  switch (action.type) {
    case login.SUCCESS:
      return onLoginSuccess(state, action as ReturnType<typeof login.success>);
    case logout.SUCCESS:
      return onLogoutSuccess(state);
    case initAuthDone.ACTION:
      return onInitAuthDone(
        state,
        action as ReturnType<typeof initAuthDone.do>,
      );
    default:
      return state;
  }
}
