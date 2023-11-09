import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import './TextArea.scss';
import { set } from 'lodash';

function TextArea({ onChange, value, rows, placeholder, ...rest }) {
  const [statement, setStatement] = useState(value);

  useEffect(() => {
    setStatement(value);
  }, [value]);

  return (
    <Input.TextArea
      className="editor-textarea"
      value={statement}
      placeholder={placeholder}
      onBlur={() => onChange(statement)}
      onChange={e => setStatement(e.target.value)}
      rows={rows}
      {...rest}
    />
  );
}

TextArea.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
};

TextArea.defaultProps = {
  onChange: () => {},
  value: '',
  placeholder: 'Placeholder',
  rows: 4,
};

export default TextArea;
