import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from '@material-ui/core';

import {
  getPosts,
  createPost,
  getPostList,
  getHasNext,
  resetPostList,
} from 'modules/post';
import { getLoading } from 'modules/loading';
import { RootState } from 'rootReducer';
import loadingGIF from 'static/images/loading.gif';

import PostCard from './components/PostCard';
import CreatePostForm from './components/CreatePostForm';

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;
const SortContainer = styled.div`
  text-align: right;
`;
const ListContainer = styled.ul`
  margin: 0;
  list-style: none;
  text-align: center;
  padding: 0;
  margin-bottom: 4rem;
`;
const ListItem = styled.li`
  margin: 1rem 0;
`;
const LoadingImg = styled.img.attrs({
  src: loadingGIF,
})`
  width: 1rem;
  height: 1rem;
`;

const PAGE_SIZE = 5;
const getFetchLoading = (state: RootState): boolean =>
  getLoading(state, getPosts);
const getCreateLoading = (state: RootState): boolean =>
  getLoading(state, createPost);

type PostListProps = {
  withCreate?: boolean;
  userId?: number;
};
const PostList = ({
  withCreate = false,
  userId,
}: PostListProps): React.ReactElement => {
  const [pageNum, setPageNum] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const dispatch = useDispatch();
  const postList = useSelector(getPostList);
  const hasNext = useSelector(getHasNext);
  const loading = useSelector(getFetchLoading);
  const creating = useSelector(getCreateLoading);

  useEffect(() => {
    dispatch(
      getPosts.request({
        filters: userId ? { userIds: [userId] } : {},
        page: { size: PAGE_SIZE, number: pageNum },
        sort: { sort: 'create_time', order },
      }),
    );
  }, [dispatch, order, pageNum, userId]);
  // onUnmount
  useEffect(() => {
    return () => {
      dispatch(resetPostList.do());
    };
  }, [dispatch]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      dispatch(resetPostList.do());
      setPageNum(0);
      setOrder(e.target.value as 'asc' | 'desc');
    },
    [dispatch, setPageNum, setOrder],
  );
  const handleLoadMore = useCallback(() => {
    setPageNum((num) => num + 1);
  }, [setPageNum]);

  const handleSubmit = useCallback(
    (form: { description: string; media: File | null }) => {
      dispatch(
        createPost.request({
          description: form.description,
          media: form.media,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Container>
      {withCreate && <CreatePostForm onSubmit={handleSubmit} />}
      <SortContainer>
        <FormControl>
          <InputLabel id="post-sorting">Sorting</InputLabel>
          <Select
            labelId="post-sorting"
            value={order}
            onChange={handleSortChange}
          >
            <MenuItem value="desc">From New to Old</MenuItem>
            <MenuItem value="asc">From Old to New</MenuItem>
          </Select>
        </FormControl>
      </SortContainer>
      <ListContainer>
        {creating && <div>Uploading...</div>}
        {postList.length === 0 && <h1>No Post</h1>}
        {postList.map((post) => (
          <ListItem key={post.id}>
            <PostCard
              userId={post.user_id}
              username={post.user.username}
              createTime={post.create_time}
              description={post.description}
              // eslint-disable-next-line camelcase
              mediaType={post.medias[0]?.media_type}
              mediaPath={post.medias[0]?.path}
            />
          </ListItem>
        ))}
        {loading && <LoadingImg alt="loading" />}
        {hasNext && (
          <Button onClick={handleLoadMore} disabled={loading}>
            Load More
          </Button>
        )}
      </ListContainer>
    </Container>
  );
};

export default PostList;
