import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './Checkbox.scss';

import { withEntityData } from 'HOCs/EntityData';

function LyticsCheckbox({ value, onChange, source, path, label, className, ...rest }) {
  const handleChange = e => {
    onChange && onChange(e.target.checked, path);
  };

  const inputValue = (value !== undefined ? value : _.get(path, source)) || false;

  return (
    <Checkbox
      className={`Checkbox ${className}`}
      checked={inputValue}
      onChange={handleChange}
      {...rest}
    >
      <sapn className="text-white fs-md fw-600">{label}</sapn>
    </Checkbox>
  );
}

export default withEntityData(LyticsCheckbox);
