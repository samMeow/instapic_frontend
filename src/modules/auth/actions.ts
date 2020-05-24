import AsyncAction from 'utils/AsyncAction';
import SyncAction from 'utils/SyncAction';

import { LoginResponse } from 'api/auth/login';
import { SignUpResponse } from 'api/auth/signUp';

interface LoginRequest {
  username: string;
  password: string;
}
export const login = new AsyncAction<LoginRequest, LoginResponse>('LOGIN');
export const logout = new AsyncAction('LOGOUT');
interface SignUpRequest {
  username: string;
  password: string;
}
export const signUp = new AsyncAction<SignUpRequest, SignUpResponse>('SIGN_UP');
export const initAuth = new SyncAction('INIT_AUTH');
export interface InitAuthDone {
  token: string;
  username: string;
}
export const initAuthDone = new SyncAction<InitAuthDone | null>(
  'INIT_AUTH_DONE',
);
