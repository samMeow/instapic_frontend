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
}
