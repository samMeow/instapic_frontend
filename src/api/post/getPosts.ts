/* eslint-disable camelcase */
import FetcherFactory from 'utils/FetcherFactory';

import InstaPicFetcher from '../InstaPicFetcher';

import { Post } from './createPost';

type PostListRequest = {
  'filters[user_ids]'?: string;
  'page[size]': number;
  'page[number]': number;
  sort: string;
  order: 'asc' | 'desc';
};

type PostListResponse = {
  data: Post[];
  meta: { has_next_page: boolean };
};

const getPosts = async (
  filters: { userIds?: number[] },
  page: { size: number; number: number },
  sort: { sort: string; order: 'asc' | 'desc' },
): Promise<PostListResponse> => {
  const fetcher = FetcherFactory.make(InstaPicFetcher);
  const req: PostListRequest = {
    'page[size]': page.size,
    'page[number]': page.number,
    sort: sort.sort,
    order: sort.order,
  };
  if (filters.userIds) {
    req['filters[user_ids]'] = filters.userIds.join(',');
  }
  const response = await fetcher.withAuth().get('/posts', req);
  const result = await response.json();
  return result;
};

export default getPosts;
