import React from 'react';
import { Progress } from 'antd';

import './Taskbar.scss';

const Taskbar = ({
  title,
  barOneStartColor,
  barOneEndColor,
  barOnePercentage,
  barOneText,
  completedText,
}) => (
  <div className="task-bar">
    <div className="task-bar-title">{title}</div>

    <div className="progress-text completed-jobs">{completedText}</div>
    <div className="task-bar-percentage">
      <Progress
        strokeColor={{
          '0%': barOneStartColor,
          '100%': barOneEndColor,
        }}
        percent={barOnePercentage}
        showInfo={false}
      />
    </div>
    <div className="progress-text">{barOneText}</div>
  </div>
);

Taskbar.propTypes = {};

Taskbar.defaultProps = {};

export default Taskbar;
