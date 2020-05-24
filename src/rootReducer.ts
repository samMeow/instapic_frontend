import { combineReducers } from 'redux';

import auth, { State as authState } from 'modules/auth/reducer';
import loading, { State as loadingState } from 'modules/loading';
import post, { State as postState } from 'modules/post';
import form, { State as formState } from 'modules/form';

export interface RootState {
  auth: authState;
  form: formState;
  loading: loadingState;
  post: postState;
}

export default combineReducers({
  auth,
  form,
  loading,
  post,
});
