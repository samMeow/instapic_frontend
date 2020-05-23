import { Action } from 'redux';

export interface State {
  username: string;
  token: string;
}

const INIT_STATE: State = {
  username: '',
  token: '',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* saga(): Iterator<any, any, any> {}

export default function reducer(state = INIT_STATE, action: Action): State {
  switch (action.type) {
    default:
      return state;
  }
}
