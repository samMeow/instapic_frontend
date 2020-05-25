import React from 'react';
import { Card } from '@material-ui/core';
import styled from 'styled-components/macro';
import { isThisWeek, formatDistanceToNow, format } from 'date-fns';

const StyledCard = styled(Card)`
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: left;
`;
const Header = styled.div`
  margin: 0.5rem 0;
`;
const Name = styled.span`
  margin-right: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
`;
const Time = styled.span`
  font-size: 0.8rem;
  font-size: light;
`;
const Description = styled.div`
  margin: 1rem 0;
  word-break: break-all;
`;
const MediaContent = styled.div`
  text-align: center;
`;
const Img = styled.img`
  max-width: 100%;
  max-height: 400px;
`;
const Video = styled.video`
  max-width: 100%;
  max-height: 400px;
`;

type PostCardProps = {
  username: string;
  createTime: string;
  description: string;
  mediaType?: string;
  mediaPath?: string;
};
const PostCard = ({
  username,
  createTime,
  description,
  mediaType,
  mediaPath,
}: PostCardProps): React.ReactElement => {
  let media = null;
  if (mediaType === 'image') {
    media = <Img src={mediaPath} alt={description} />;
  }
  if (mediaType === 'video') {
    media = (
      <Video controls>
        <source src={mediaPath} />
      </Video>
    );
  }
  const createDate = new Date(createTime);
  const displayTime = isThisWeek(createDate)
    ? formatDistanceToNow(createDate, { addSuffix: true })
    : format(createDate, 'do MMM');

  return (
    <StyledCard>
      <Header>
        <Name>{username}</Name>
        <Time>{displayTime}</Time>
      </Header>
      <Description>{description}</Description>
      <MediaContent>{media}</MediaContent>
    </StyledCard>
  );
};

export default PostCard;
