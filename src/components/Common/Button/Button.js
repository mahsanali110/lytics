import PropTypes from 'prop-types';
import { Button } from 'antd';

import './Button.scss';

const IMSButton = ({
  children,
  variant,
  type,
  icon: Icon,
  onClick,
  extraClass,
  iconProps,
  ...rest
}) => {
  return (
    <div className="ims-button-wrapper">
      <Button
        className={`action-btn ${variant}-btn ${type}-btn ${extraClass}`}
        {...(Icon ? { icon: <Icon {...iconProps} /> } : {})}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Button>
    </div>
  );
};

IMSButton.propTypes = {
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  type: PropTypes.oneOf(['medium', 'big', 'small']),
  children: PropTypes.node,
  icon: PropTypes.any,
};

IMSButton.defaultProps = {
  variant: 'primary',
  type: 'medium',
  iconProps: {},
};

export default IMSButton;
