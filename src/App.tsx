import React from 'react';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoggedIn, isAuthInited } from 'modules/auth/selectors';

import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';

const PublicRoute = (props: RouteProps): React.ReactElement => {
  const loggedIn = useSelector(isLoggedIn);
  if (loggedIn) {
    return <Redirect to="/" />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...props} />;
};

const PrivateRoute = (props: RouteProps): React.ReactElement => {
  const loggedIn = useSelector(isLoggedIn);
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...props} />;
};

function App(): React.ReactElement | null {
  const inited = useSelector(isAuthInited);
  if (!inited) {
    // TODO: App loading component
    return null;
  }
  return (
    <Switch>
      <PublicRoute exact path="/login" component={LoginPage} />
      <PublicRoute exact path="/register" component={SignUpPage} />
      <PrivateRoute exact path="/">
        Private
      </PrivateRoute>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
