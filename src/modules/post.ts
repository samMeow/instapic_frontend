import { Action } from 'redux';
import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import AsyncAction from 'utils/AsyncAction';
import SyncAction from 'utils/SyncAction';

import getPostsAPI, { PostListResponse } from 'api/post/getPosts';
import createPostAPI, { Post, CreatePostResponse } from 'api/post/createPost';
import { fetchHandler } from 'utils/sagaHelper';

export interface State {
  ui: {
    tempList: number[];
    dataList: number[];
    hasNext: boolean;
  };
  dict: {
    [id: number]: Post;
  };
}
export const INIT_STATE: State = {
  ui: {
    tempList: [],
    dataList: [],
    hasNext: false,
  },
  dict: {},
};

// ===== action =====
export interface GetPostsRequest {
  filters: { userIds?: number[] };
  page: { size: number; number: number };
  sort: { sort: string; order: 'asc' | 'desc' };
}
export const getPosts = new AsyncAction<GetPostsRequest, PostListResponse>(
  'GET_POSTS',
);
interface CreatePostRequest {
  description: string;
  media: File | null;
}
export const createPost = new AsyncAction<
  CreatePostRequest,
  CreatePostResponse
>('CREATE_POST');
export const resetPostList = new SyncAction('RESET_POST_LIST');

// ===== selector =====
export const getHasNext = (state: { post: State }): boolean =>
  state.post.ui.hasNext;
export const getPostList = (state: { post: State }): Post[] => {
  const temp: { [k: number]: boolean } = state.post.ui.tempList.reduce(
    (memo, number) => ({ ...memo, [number]: true }),
    {},
  );
  const dataList = state.post.ui.dataList.filter((x) => !temp[x]);
  return [...state.post.ui.tempList, ...dataList].map(
    (x) => state.post.dict[x],
  );
};

// ===== saga =====
export const handleGetPosts = fetchHandler(
  getPosts,
  getPostsAPI,
  ({ filters, page, sort }) => [filters, page, sort],
);
export const handleCreatePost = fetchHandler(
  createPost,
  createPostAPI,
  ({ description, media }) => [description, media],
);
export function* handleGetPostsFail({
  error,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ReturnType<typeof getPosts.failure>): Iterator<any> {
  yield call([toast, 'error'], error.message);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* saga(): Iterator<any> {
  yield takeEvery(getPosts.REQUEST, handleGetPosts);
  yield takeEvery(createPost.REQUEST, handleCreatePost);
  yield takeEvery(getPosts.FAILURE, handleGetPostsFail);
}

// ===== reducer =====
const onGetPostsSuccess = (
  state: State,
  action: ReturnType<typeof getPosts.success>,
): State => {
  const {
    payload: { data, meta },
    request: {
      page: { size, number },
    },
  } = action;
  const newList = [...state.ui.dataList];
  newList.splice(size * number, size, ...data.map((x) => x.id));
  return {
    ...state,
    ui: {
      ...state.ui,
      dataList: newList,
      hasNext: meta.has_next_page,
    },
    dict: data.reduce(
      (memo, post) => ({
        ...memo,
        [post.id]: post,
      }),
      state.dict,
    ),
  };
};

const onCreatePostSuccess = (
  state: State,
  { payload: { data } }: ReturnType<typeof createPost.success>,
): State => ({
  ...state,
  ui: {
    ...state.ui,
    tempList: [data.id, ...state.ui.tempList],
  },
  dict: {
    ...state.dict,
    [data.id]: data,
  },
});

const onResetPostList = (state: State): State => ({
  ...state,
  ui: {
    tempList: [],
    dataList: [],
    hasNext: false,
  },
});

export default function reducer(state = INIT_STATE, action: Action): State {
  switch (action.type) {
    case getPosts.SUCCESS:
      return onGetPostsSuccess(
        state,
        action as ReturnType<typeof getPosts.success>,
      );
    case createPost.SUCCESS:
      return onCreatePostSuccess(
        state,
        action as ReturnType<typeof createPost.success>,
      );
    case resetPostList.ACTION:
      return onResetPostList(state);
    default:
      return state;
  }
}
