import React from 'react';
import styled from 'styled-components/macro';

import { device } from 'styles/device';

const Header = styled.h1`
  font-size: 2.5rem;
  @media ${device.tabletP} {
    font-size: 3rem;
  }
`;

const Slogan = (): React.ReactElement => <Header>InstaPic</Header>;

export default Slogan;
