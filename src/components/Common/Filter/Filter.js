import React from 'react';
import { Checkbox } from 'antd';

import './Filter.scss';

const Taskbar = ({ title, options, defaultValue, onCheckboxChange }) => (
  <div className='filters'>
    <span className='checkbox-pre-label'>{title}</span>
    <Checkbox.Group options={options} defaultValue={[defaultValue]} onChange={onCheckboxChange} />
  </div>
);

Taskbar.propTypes = {};

Taskbar.defaultProps = {};

export default Taskbar;
