import React from 'react';
import styled from 'styled-components/macro';

const Img = styled.img`
  max-width: 100%;
  max-height: 400px;
`;
const Video = styled.video`
  max-width: 100%;
  max-height: 400px;
`;

type MediaPreviewProps = {
  file: File;
};
const MediaPreview = ({
  file,
}: MediaPreviewProps): React.ReactElement | null => {
  if (file.type.startsWith('video')) {
    return (
      <Video controls>
        <source src={URL.createObjectURL(file)} />
      </Video>
    );
  }
  if (file.type.startsWith('image')) {
    return <Img src={URL.createObjectURL(file)} alt="preview" />;
  }
  return null;
};

export default MediaPreview;
