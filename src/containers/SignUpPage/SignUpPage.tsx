import React, { useState, useCallback, useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import PublicLayout from 'components/PublicLayout';
import Slogan from 'components/Slogan';
import { signUp } from 'modules/auth/actions';
import { getLoading } from 'modules/loading';
import { getFormErrorMessage, getFormSuccess, resetForm } from 'modules/form';
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
const SuccessMessage = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  color: green;
`;
const ButtonSlot = styled.div`
  margin-top: 2rem;
  width: 100%;
  text-align: right;
`;

const getSignUpLoading = (state: RootState): boolean =>
  getLoading(state, signUp);
const getSignUpError = curryRight2(getFormErrorMessage)('signUpForm');
const getSignUpSuccess = curryRight2(getFormSuccess)('signUpForm');

type FormField = {
  value: string;
  error: string;
};
interface State {
  username: FormField;
  password: FormField;
  [k: string]: FormField;
}
const INIT_STATE = {
  username: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
};
const LoginPage = (): React.ReactElement => {
  const [form, setForm] = useState<State>(INIT_STATE);
  const dispatch = useDispatch();
  const loading = useSelector(getSignUpLoading);
  const errorMessage = useSelector(getSignUpError);
  const success = useSelector(getSignUpSuccess);

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
        signUp.request({
          username: form.username.value,
          password: form.password.value,
        }),
      );
      setForm(INIT_STATE);
    },
    [form, setForm, dispatch, validate],
  );

  useEffect(() => {
    return () => {
      dispatch(resetForm.do('loginForm'));
    };
  }, [dispatch]);

  return (
    <PublicLayout>
      <Container>
        <Slogan />
        <Title>Register Now</Title>
        <Form onSubmit={handleSubmit} autoComplete="false">
          <StyledTextField
            name="username"
            label="New Username"
            value={form.username.value}
            onChange={handleChange}
            variant="outlined"
            error={form.username.error.length > 0}
            helperText={form.username.error}
          />
          <StyledTextField
            name="password"
            label="New Password"
            type="password"
            value={form.password.value}
            onChange={handleChange}
            variant="outlined"
            error={form.password.error.length > 0}
            helperText={form.password.error}
          />
          <Description>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Already a member? <Link to="/login">Login now!</Link>
          </Description>
          {success && <SuccessMessage>Successfully Register</SuccessMessage>}
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <ButtonSlot>
            <Button type="submit" disabled={loading}>
              Sign Up
            </Button>
          </ButtonSlot>
        </Form>
      </Container>
    </PublicLayout>
  );
};

export default LoginPage;
