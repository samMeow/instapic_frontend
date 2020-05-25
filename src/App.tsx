import React from 'react';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoggedIn, isAuthInited } from 'modules/auth/selectors';
import { ToastContainer } from 'react-toastify';

import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';

const LazyPostPage = React.lazy(() => import('./containers/PostsPage'));
const LazyUserPage = React.lazy(() => import('./containers/UserPage'));

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

const AppLoading = (): React.ReactElement => <h1>Loading...</h1>;

function App(): React.ReactElement {
  const inited = useSelector(isAuthInited);
  if (!inited) {
    // TODO: App loading component
    return <AppLoading />;
  }
  return (
    <React.Suspense fallback={<AppLoading />}>
      <Switch>
        <PublicRoute exact path="/login" component={LoginPage} />
        <PublicRoute exact path="/register" component={SignUpPage} />
        <PrivateRoute exact path="/" component={LazyPostPage} />
        <PrivateRoute exact path="/users/:userId" component={LazyUserPage} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
      <ToastContainer />
    </React.Suspense>
  );
}

export default App;
