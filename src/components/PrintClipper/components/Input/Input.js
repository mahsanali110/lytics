import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import './Input.scss';

function PrintClipperInput({ onChange, value, placeholder, ...rest }) {
  const [innerValue, setInnerValue] = useState(value);
  const handleChange = e => {
    setInnerValue(e.target.value);
  };

  useEffect(() => {
    setInnerValue(value);
  }, [value]);
  return (
    <Input
      className="print-clipper-input"
      onChange={handleChange}
      onBlur={() => onChange(innerValue)}
      value={innerValue}
      placeholder={placeholder}
      {...rest}
    />
  );
}

PrintClipperInput.PropTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
};

PrintClipperInput.defaultProps = {
  onChange: () => {},
  value: '',
  placeholder: '',
  maxLength: 200,
};

export default PrintClipperInput;
