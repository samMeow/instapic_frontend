export const RequestAction = {};
export const SuccessAction = {};
export const FailureAction = {};
export default class AsyncAction {
  REQUEST = '_REQUEST';

  SUCCESS = '_SUCCESS';

  FAILURE = '_FAILURE';

  constructor(base) {
    this.REQUEST = `${base}${this.REQUEST}`;
    this.SUCCESS = `${base}${this.SUCCESS}`;
    this.FAILURE = `${base}${this.FAILURE}`;
  }

  request = (p) => ({
    type: this.REQUEST,
    payload: p,
  });

  success = (payload, request) => ({
    type: this.SUCCESS,
    payload,
    request,
  });

  failure = (e, request) => ({
    type: this.FAILURE,
    error: e,
    request,
  });

  toBase = () => AsyncAction.toBase(this.REQUEST);

  static toBase = (x) => x.replace(/_(REQUEST|SUCCESS|FAILURE)$/, '');

  static isRequestAction = (a) => /_REQUEST$/.test(a.type);

  static isSuccessAction = (a) => /_SUCCESS$/.test(a.type);

  static isFailureAction = (a) => /_FAILURE$/.test(a.type);
}
