import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
const { TextArea } = Input;

const IMSTextArea = ({ onChange, value, index, rowKey, ...rest }) => {
  const [statement, setStatement] = React.useState(value);
  const updateRedux = (callback, delay, value) => {
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(value, index, rowKey);
    }, delay);
  };
  return (
    <TextArea
      value={statement}
      placeholder="Statement Here"
      style={{ fontSize: '11px' }}
      //   onBlur={e => onChange(statement, index, key)}
      onChange={e => {
        setStatement(e.target.value);
        updateRedux(onChange, 1000, e.target.value);
      }}
      rows={2}
      {...rest}
    />
  );
};
IMSTextArea.defaultProps = {
  onChange: () => {},
  value: '',
  index: 0,
  key: 0,
};

export default IMSTextArea;
