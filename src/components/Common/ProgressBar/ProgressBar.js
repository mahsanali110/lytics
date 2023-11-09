import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';

import './ProgressBar.scss';

function ProgressBar({ percent, ...rest }) {
  return <Progress className="progress-bar" percent={percent} {...rest} />;
}

ProgressBar.PropTypes = {
  percent: PropTypes.number,
};

ProgressBar.defaultProps = {
  percent: 75,
};

export default ProgressBar;
