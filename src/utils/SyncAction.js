export default class SyncAction {
  ACTION = '';

  constructor(action) {
    this.ACTION = action;
  }

  do = (payload) => ({
    type: this.ACTION,
    ...(payload && { payload }),
  });
}
