export default class SyncAction<T> {
  ACTION: string;

  constructor(action: string);

  do(payload?: T): { type: string; payload: T };
}
