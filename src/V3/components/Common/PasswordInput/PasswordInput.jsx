import React from 'react';
import _ from 'lodash';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import PropTypes from 'prop-types';

import './PasswordInput.scss';

import { withEntityData } from 'HOCs/EntityData';

function PasswordInput({ value, path, source, onChange, label, className, shape, ...rest }) {
  const handleChange = e => {
    onChange && onChange(e.target.value, path);
  };

  const inputValue = (value !== undefined ? value : _.get(path, source)) || '';
  return (
    <div className="w-100">
      {label && (
        <label
          className="fs-md fw-600 ff-roboto py-5 inline-block text-white"
          htmlFor={'PasswordInput'}
        >
          {label}
        </label>
      )}
      <Input.Password
        className={`PasswordInput input-field-regular ${shape} ${className}`}
        value={inputValue}
        onChange={handleChange}
        iconRender={visible =>
          visible ? (
            <EyeTwoTone style={{ color: 'white', fill: 'white' }} />
          ) : (
            <EyeInvisibleOutlined style={{ color: 'white', fill: 'white' }} />
          )
        }
        id={'PasswordInput'}
        {...rest}
      />
    </div>
  );
}

PasswordInput.defaultProps = {
  value: '',
  onChange: () => {},
  shape: 'round',
};

PasswordInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default withEntityData(PasswordInput);
