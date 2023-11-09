import React from 'react';

import PropTypes from 'prop-types';
import { PublicRoute, PrivateRoute } from '../../../modules/common/routes';
import { getUserId, getUser } from '../../../modules/common/utils';

const RouteWithLayout = props => {
  const user = getUser()
  const isAuthenticated = !!getUserId();

  const role = user?.role?.toLowerCase();


  const { layout: Layout, component: Component, protectedRoute, ...rest } = props;

  return protectedRoute ? (
    <PrivateRoute
    isAuthenticated={isAuthenticated}
    role={role}
    component={matchProps => (
      <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
      {...rest}
    />
  ) : (
    <PublicRoute
    role={role}
    isAuthenticated={isAuthenticated}
    component={matchProps => (
      <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
      {...rest}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string.isRequired,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  protectedRoute: PropTypes.bool,
};

export default RouteWithLayout;
