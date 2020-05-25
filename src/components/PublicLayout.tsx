import React from 'react';
import { Card } from '@material-ui/core';
import styled from 'styled-components/macro';

import { device } from 'styles/device';
import { ROSE_RED, VIOLET } from 'styles/color';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(${ROSE_RED}, ${VIOLET});
`;

const StyledCard = styled(Card)`
  width: 100%;
  margin: 1rem;
  @media ${device.tabletP} {
    width: 500px;
  }
`;

const PublicLayout = ({
  children,
}: React.PropsWithChildren<unknown>): React.ReactElement => (
  <Container>
    <StyledCard>{children}</StyledCard>
  </Container>
);

export default PublicLayout;
