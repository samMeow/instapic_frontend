import React from 'react';
import styled from 'styled-components/macro';

import Header from 'containers/Header';
import PostList from 'containers/PostList';
import { device, size } from 'styles/device';
import { LIGHT_GREY } from 'styles/color';

const Container = styled.div`
  background-color: ${LIGHT_GREY};
  min-height: 100vh;
  width: 100%;
`;

const ListContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem;
  margin: auto;
  @media ${device.tabletP} {
    width: ${size.tabletP};
  }
`;

const PostPage = (): React.ReactElement => {
  return (
    <Container>
      <Header />
      <ListContainer>
        <PostList />
      </ListContainer>
    </Container>
  );
};

export default PostPage;
