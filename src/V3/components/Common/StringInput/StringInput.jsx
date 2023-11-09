import React, { useId } from 'react';
import _ from 'lodash';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import './StringInput.scss';

import { withEntityData } from 'HOCs/EntityData';

function StringInput({
  value,
  path,
  source,
  onChange,
  label,
  className,
  shape,
  maxLength,
  ...rest
}) {
  const handleChange = e => {
    onChange && onChange(e.target.value, path);
  };
  // const id = useId();

  const inputValue = (value !== undefined ? value : _.get(source, path)) || '';
  return (
    <div className="w-100">
      {label && (
        <label
          className="fs-md fw-600 ff-roboto py-5 inline-block text-white"
          htmlFor={'StringInput'}
        >
          {label}
        </label>
      )}
      <Input
        className={`StringInput input-field-regular ${className} ${shape}`}
        value={inputValue}
        onChange={handleChange}
        id={'StringInput'}
        maxLength={maxLength}
        {...rest}
      />
    </div>
  );
}

StringInput.defaultProps = {
  value: '',
  onChange: () => {},
  shape: 'round',
  maxLength: '64',
};

StringInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  shape: PropTypes.oneOf(['round, square']),
};

export default withEntityData(StringInput);
