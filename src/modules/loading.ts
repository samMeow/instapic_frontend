import { Action } from 'redux';

import AsyncAction, {
  RequestAction,
  SuccessAction,
  FailureAction,
} from 'utils/AsyncAction';

type Status = {
  loading: boolean;
};
export interface State {
  [k: string]: Status;
}
const INIT_STATE: State = {};

// ===== selector =====
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLoading = <T = any>(
  state: { loading: State },
  action: AsyncAction,
  subkey?: T,
): boolean => {
  let key = action.toBase();
  if (subkey) {
    key = `${key}${JSON.stringify(subkey)}`;
  }
  return state.loading[key]?.loading;
};

// ===== reducer =====
const onRequestAction = (state: State, action: RequestAction): State => {
  const newStatus = {
    loading: true,
    errorMessage: '',
    done: false,
  };
  const base = AsyncAction.toBase(action.type);
  let subkey = '';
  if (action.payload) {
    subkey = `${base}${JSON.stringify(action.payload)}`;
  }
  return {
    ...state,
    [base]: newStatus,
    ...(subkey && { [subkey]: newStatus }),
  };
};

const onFinishAction = (
  state: State,
  action: SuccessAction | FailureAction,
): State => {
  const newStatus = {
    loading: false,
    errorMessage: '',
    done: true,
  };
  const base = AsyncAction.toBase(action.type);
  let subkey = '';
  if (action.request) {
    subkey = `${base}${JSON.stringify(action.request)}`;
  }
  return {
    ...state,
    [base]: newStatus,
    ...(subkey && { [subkey]: newStatus }),
  };
};

export default function reducer(state = INIT_STATE, action: Action): State {
  if (AsyncAction.isRequestAction(action)) {
    return onRequestAction(state, action as RequestAction);
  }
  if (AsyncAction.isSuccessAction(action)) {
    return onFinishAction(state, action as SuccessAction);
  }
  if (AsyncAction.isFailureAction(action)) {
    return onFinishAction(state, action as FailureAction);
  }
  return state;
}
