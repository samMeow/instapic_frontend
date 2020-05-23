import { combineReducers } from 'redux';

import auth, { State as authState } from 'modules/auth';

export interface RootState {
  auth: authState;
}

export default combineReducers({
  auth,
});
