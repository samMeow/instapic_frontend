/* eslint-disable camelcase */
import FetcherFactory from 'utils/FetcherFactory';

import InstaPicFetcher from '../InstaPicFetcher';

export type Post = {
  id: number;
  description: string;
  medias: {
    id: number;
    post_id: number;
    media_type: string;
    path: string;
    create_time: string;
  }[];
  user_id: number;
  create_time: string;
  user: {
    id: number;
    username: string;
  };
};

export type CreatePostResponse = {
  data: Post;
};

const createPost = async (
  description: string,
  media: File | null,
): Promise<CreatePostResponse> => {
  const fetcher = FetcherFactory.make(InstaPicFetcher);
  const response = await fetcher.withAuth().form().post('/posts', {
    description,
    media,
  });
  const result = await response.json();
  return result;
};

export default createPost;
