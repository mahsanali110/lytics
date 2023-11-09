import PropTypes from 'prop-types';

import './MinimalLayout.scss';

const MinimalLayout = props => {
  const { children } = props;

  return <div className="MinimalLayout">{children}</div>;
};

MinimalLayout.propTypes = {
  children: PropTypes.node,
};

export default MinimalLayout;
