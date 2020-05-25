import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import getPostsAPI from 'api/post/getPosts';
import createPostAPI, { Post } from 'api/post/createPost';
import reducer, {
  getPosts,
  INIT_STATE,
  GetPostsRequest,
  createPost,
  resetPostList,
  handleGetPosts,
  handleCreatePost,
  saga,
  getPostList,
} from '../post';

describe('modules/post', () => {
  const post1: Post = {
    id: 3,
    description: '',
    medias: [],
    user_id: 1,
    create_time: '2020-05-24T03:48:07.835Z',
    user: {
      id: 1,
      username: 'a',
    },
  };
  const post2: Post = {
    id: 4,
    description: '',
    medias: [],
    user_id: 4,
    create_time: '2020-05-24T04:48:07.835Z',
    user: {
      id: 4,
      username: 'b',
    },
  };
  const post3: Post = {
    id: 5,
    description: '',
    medias: [],
    user_id: 5,
    create_time: '2020-05-25T04:48:07.835Z',
    user: {
      id: 5,
      username: 'e',
    },
  };
  describe('reducer', () => {
    it('should get post correctly', () => {
      const response = {
        data: [post1, post2],
        meta: { has_next_page: true },
      };
      const request: GetPostsRequest = {
        filters: {},
        page: { size: 2, number: 0 },
        sort: { sort: 'create_time', order: 'asc' },
      };
      const final = reducer(INIT_STATE, getPosts.success(response, request));
      expect(final).toMatchObject({
        ui: {
          dataList: [post1.id, post2.id],
          hasNext: true,
        },
        dict: {
          [post1.id]: post1,
          [post2.id]: post2,
        },
      });
    });

    it('should add post to tempList after create Post success', () => {
      const final = reducer(INIT_STATE, createPost.success({ data: post1 }));
      expect(final).toMatchObject({
        ui: {
          tempList: [post1.id],
        },
        dict: {
          [post1.id]: post1,
        },
      });
    });

    it('should reset UI status when RESET_POST_LIST', () => {
      const final = reducer(INIT_STATE, resetPostList.do());
      expect(final).toMatchObject({
        ui: {
          tempList: [],
          dataList: [],
          hasNext: false,
        },
      });
    });
  });

  describe('saga', () => {
    it('should run without blocking', () => {
      return expectSaga(saga)
        .returns(undefined)
        .run({ timeout: 5, silenceTimeout: true });
    });

    it('should transform getPosts request correctly', () => {
      const request: GetPostsRequest = {
        filters: { userIds: [1] },
        page: { size: 2, number: 0 },
        sort: { sort: 'create_time', order: 'asc' },
      };
      return expectSaga(handleGetPosts, getPosts.request(request))
        .provide([[call.fn(getPostsAPI), null]])
        .call(getPostsAPI, request.filters, request.page, request.sort)
        .run();
    });

    it('should transform createPostRequest correctly', () => {
      const request = {
        description: 'hello',
        media: new File(['b'], 'b.txt'),
      };
      return expectSaga(handleCreatePost, createPost.request(request))
        .provide([[call.fn(createPostAPI), null]])
        .call(createPostAPI, request.description, request.media)
        .run();
    });
  });

  describe('selector', () => {
    it('should get Post list combined from data and temp', () => {
      const state = {
        ui: {
          tempList: [post1.id],
          dataList: [post3.id, post1.id, post2.id],
          hasNext: false,
        },
        dict: {
          [post1.id]: post1,
          [post2.id]: post2,
          [post3.id]: post3,
        },
      };
      expect(getPostList({ post: state })).toMatchObject([post1, post3, post2]);
    });
  });
});
