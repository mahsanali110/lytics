import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import './Input.scss';

function LyticsInput({ value, handleChange, ...rest }) {
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return (
    <Input
      className="lytics-input"
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      onBlur={() => handleChange(inputValue)}
      {...rest}
    />
  );
}

LyticsInput.propTypes = {
  value: PropTypes.string,
  hanldeChange: PropTypes.func,
};

LyticsInput.defaultProps = {
  value: '',
  handleChange: () => {},
};

export default LyticsInput;
