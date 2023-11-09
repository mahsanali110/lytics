import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import AclService from 'services/acl';

export const PrivateRoute = ({ component: Component, isAuthenticated, role, path, ...rest }) => {
  const aclService = new AclService(role);
  const permitted = aclService.hasPermission(path);
  const whiteListUrls = ['/not-found', aclService.redirectUrl];

  let redirect = '/';

  redirect = (isAuthenticated && !permitted && aclService.redirectUrl) || '/';

  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated && (permitted || whiteListUrls.includes(path)) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export const PublicRoute = ({ component: Component, isAuthenticated, role, ...rest }) => {
  const aclService = new AclService(role);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated === true ? (
          <Redirect to={aclService.landingPage} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
