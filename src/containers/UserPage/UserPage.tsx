import React from 'react';
import styled from 'styled-components/macro';
import { useParams, Redirect } from 'react-router-dom';

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

const UserPage = (): React.ReactElement => {
  const { userId } = useParams();
  if (Number(userId) < 1) {
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <Header />
      <ListContainer>
        <PostList userId={Number(userId)} />
      </ListContainer>
    </Container>
  );
};

export default UserPage;
