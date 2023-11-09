import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

import './SingleSelect.scss';

const { Option } = Select;
import { withEntityData } from 'HOCs/EntityData';

function SingleSelect({
  path,
  value,
  source,
  onChange,
  className,
  options,
  label,
  showArrow,
  allowClear,
  ...rest
}) {
  const handleOnChange = value => {
    onChange && onChange(value, path);
  };

  const inputValue = (value !== undefined ? value : _.get(path, source)) || '';

  return (
    <div>
      {label && (
        <label className="fs-md fw-600 ff-roboto py-5 inline-block text-white">{label}</label>
      )}
      <Select
        value={inputValue}
        className={`SingleSelect  ${className}`}
        onChange={handleOnChange}
        optionLabelProp="label"
        dropdownStyle={{
          background: '#444444',
          border: '1px solid white',
          borderRadius: '6px',
        }}
        popupClassName={'DropDown'}
        {...rest}
      >
        {options.map(option => (
          <Option
            className="v3-option-single"
            key={option.value}
            value={option.value}
            label={option.title}
          >
            <div className="select-item">
              <span className="fs-md">{option.title}</span>
            </div>
          </Option>
        ))}
      </Select>
    </div>
  );
}

SingleSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  source: PropTypes.object,
};

SingleSelect.defaultProps = {
  onChange: () => {},
  options: [],
  source: {},
  value: [],
  showArrow: true,
  allowClear: true,
};

export default withEntityData(SingleSelect);
