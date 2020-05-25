import React, { useState, useCallback } from 'react';
import { Input, Button } from '@material-ui/core';
import styled from 'styled-components/macro';
import { toast } from 'react-toastify';

import mediaImg from 'static/images/media.svg';

import MediaPreview from './MediaPreview';

const StyledForm = styled.form`
  border: 1px #888 solid;
  border-radius: 0.5rem;
`;
const StyledInput = styled(Input)`
  margin: 0.5rem;
`;
const ActionBar = styled.div`
  display: flex;
  border-top: 1px #888 solid;
`;
const FileInput = styled.label`
  flex: 1;
  & input[type='file'] {
    display: none;
  }
`;
const MediaImg = styled.img.attrs({
  src: mediaImg,
})`
  width: 1rem;
  height: 1rem;
  margin-right: 1rem;
`;
const PostButton = styled(Button)`
  flex: 1;
`;
const PreviewContainer = styled.div`
  text-align: center;
`;

interface State {
  description: string;
  media: File | null;
}
type CreatePostFormProps = {
  className?: string;
  onSubmit: (f: State) => void;
};
const CreatePostForm = ({
  className,
  onSubmit,
}: CreatePostFormProps): React.ReactElement => {
  const [form, setForm] = useState<State>({
    description: '',
    media: null,
  });

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newForm = {
        ...form,
        description: e.target.value,
      };
      setForm(newForm);
    },
    [form, setForm],
  );
  const validateFile = useCallback((file: File): string => {
    if (!file.type.startsWith('video') && !file.type.startsWith('image')) {
      return 'Post only accept video / image';
    }
    if (file.size > 3 * 1024 * 1024) {
      return 'Media cannot be > 3MB';
    }
    return '';
  }, []);
  const handleFileChange = useCallback(
    (e) => {
      if (!e.target.files[0]) {
        return;
      }
      const media = e.target.files[0];
      const error = validateFile(media);
      if (error) {
        toast.error(error);
        return;
      }
      setForm({ ...form, media });
    },
    [form, setForm, validateFile],
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(form);
      setForm({ description: '', media: null });
    },
    [onSubmit, form, setForm],
  );
  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer.items) {
        return;
      }
      if (e.dataTransfer.items.length !== 1) {
        toast.error('Only support one file at a time');
        return;
      }
      const media = e.dataTransfer.items[0].getAsFile() as File;
      const error = validateFile(media);
      if (error) {
        toast.error(error);
        return;
      }
      setForm({ ...form, media });
    },
    [form, setForm, validateFile],
  );

  return (
    <StyledForm
      className={className}
      onSubmit={handleSubmit}
      onDrop={handleFileDrop}
      data-testid="create-post-form"
    >
      <StyledInput
        name="description"
        multiline
        rows={6}
        placeholder="What do you think today?"
        fullWidth
        disableUnderline
        value={form.description}
        onChange={handleDescriptionChange}
      />
      {form.media && (
        <PreviewContainer>
          <MediaPreview file={form.media} />
        </PreviewContainer>
      )}
      <ActionBar>
        <FileInput htmlFor="upload-media">
          <input id="upload-media" type="file" onChange={handleFileChange} />
          <Button component="span" fullWidth>
            <MediaImg />
            <span>Upload Media</span>
          </Button>
        </FileInput>
        <PostButton type="submit" disabled={form.description.length === 0}>
          Post
        </PostButton>
      </ActionBar>
    </StyledForm>
  );
};

export default CreatePostForm;
