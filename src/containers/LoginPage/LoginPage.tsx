import React, { useState, useCallback } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import PublicLayout from 'components/PublicLayout';
import Slogan from 'components/Slogan';
import { login } from 'modules/auth/actions';
import { getLoading } from 'modules/loading';
import { getFormErrorMessage } from 'modules/form';
import { curryRight2 } from 'utils/fn';
import { RootState } from 'rootReducer';

const Container = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.2rem;
`;
const StyledTextField = styled(TextField)``;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem 4rem;
  margin-bottom: 1rem;
  & ${StyledTextField} {
    margin: 0.5rem 0;
  }
`;

const Description = styled.div`
  font-size: 0.8rem;
  text-align: left;
  color: #888;
`;
const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.8rem;
`;
const ButtonSlot = styled.div`
  margin-top: 2rem;
  width: 100%;
  text-align: right;
`;

const getLoginLoading = (state: RootState): boolean => getLoading(state, login);
const getLoginError = curryRight2(getFormErrorMessage)('loginForm');

type FormField = {
  value: string;
  error: string;
};
interface State {
  username: FormField;
  password: FormField;
  [k: string]: FormField;
}
const LoginPage = (): React.ReactElement => {
  const [form, setForm] = useState<State>({
    username: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
    },
  });
  const dispatch = useDispatch();
  const loading = useSelector(getLoginLoading);
  const errorMessage = useSelector(getLoginError);

  const validate = useCallback((newForm: State): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (newForm.username.value.length < 6) {
      errors.username = 'Username too short';
    }
    if (newForm.password.value.length < 6) {
      errors.password = 'Password too short';
    }
    return errors;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const newForm = {
        ...form,
        [name]: {
          value: e.target.value,
          error: '',
        },
      };
      const errors = validate(newForm);
      newForm[name].error = errors[name] || '';
      setForm(newForm);
    },
    [form, setForm, validate],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validate(form);
      if (Object.keys(errors).length > 0) {
        setForm(
          Object.entries(errors).reduce(
            (f, [k, error]) => ({
              ...f,
              [k]: {
                ...f[k],
                error,
              },
            }),
            form,
          ),
        );
        return;
      }
      dispatch(
        login.request({
          username: form.username.value,
          password: form.password.value,
        }),
      );
    },
    [form, setForm, dispatch, validate],
  );

  return (
    <PublicLayout>
      <Container>
        <Slogan />
        <Title>Login Here</Title>
        <Form onSubmit={handleSubmit} autoComplete="false">
          <StyledTextField
            name="username"
            label="Username"
            onChange={handleChange}
            variant="outlined"
            error={form.username.error.length > 0}
            helperText={form.username.error}
          />
          <StyledTextField
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            variant="outlined"
            error={form.password.error.length > 0}
            helperText={form.password.error}
          />
          <Description>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Not yet a member? <Link to="/register">Sign Up here!</Link>
          </Description>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <ButtonSlot>
            <Button type="submit" disabled={loading}>
              Login
            </Button>
          </ButtonSlot>
        </Form>
      </Container>
    </PublicLayout>
  );
};

export default LoginPage;
