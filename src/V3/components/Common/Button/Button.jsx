import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

function Button({ children, className, disabled, onClick, size, varient, shape, ...rest }) {
  return (
    <button
      className={`Button w-100  ${varient} ${shape} ${size} ${className} ${
        disabled ? 'disabled' : ''
      }`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  onClick: () => {},
  varient: 'primary',
  shape: 'round',
};

Button.propTypes = {
  onClick: PropTypes.func,
  varient: PropTypes.oneOf(['primary', 'secondary', 'transparent']),
};

export default Button;
