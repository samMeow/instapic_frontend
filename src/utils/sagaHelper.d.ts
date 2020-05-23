import { Action } from 'redux';
import AsyncAction from 'utils/AsyncAction';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SagaHandler = (action: Action) => any;

export function fetchHandler<R, S, A1>(
  action: AsyncAction<R, S>,
  api: (x: A1) => Promise<S>,
  transform?: (x: R) => [A1],
): SagaHandler;
export function fetchHandler<R, S, A1, A2>(
  action: AsyncAction<R, S>,
  api: (a: A1, b: A2) => Promise<S>,
  transform: (x: R) => [A1, A2],
): SagaHandler;
export function fetchHandler<R, S, A1, A2, A3>(
  action: AsyncAction<R, S>,
  api: (a: A1, b: A2, c: A3) => Promise<S>,
  transform: (x: R) => [A1, A2, A3],
): SagaHandler;

export function once(
  pattern: string,
  handler: SagaHandler,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<any, any, any>;

export function takeOnce(
  pattern: string,
  handler: SagaHandler,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<any, any, any>;
