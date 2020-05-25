import React, { useCallback } from 'react';
import styled from 'styled-components/macro';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { getUsername } from 'modules/auth/selectors';
import { logout } from 'modules/auth/actions';
import { device, size } from 'styles/device';
import { SEA_BLUE } from 'styles/color';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${SEA_BLUE};
  height: 3rem;
  z-index: 100;
`;
const InnerContainer = styled.div`
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;

  @media ${device.tabletL} {
    width: ${size.tabletL};
  }
`;
const Left = styled.div`
  font-size: 1.2rem;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
`;
const RightText = styled.span`
  margin-right: 0.5rem;
`;

const Header = (): React.ReactElement => {
  const username = useSelector(getUsername);
  const dispatch = useDispatch();

  const handleLogoutClick = useCallback(() => {
    dispatch(logout.request());
  }, [dispatch]);

  return (
    <Container>
      <InnerContainer>
        <Left>InstaPic</Left>
        <Right>
          <RightText>{username}</RightText>
          <Button onClick={handleLogoutClick}>Logout</Button>
        </Right>
      </InnerContainer>
    </Container>
  );
};

export default Header;
