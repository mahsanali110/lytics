import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import _ from 'lodash';

import './MultiSelect.scss';

import { Checkbox } from '../';
import { CheckSVG } from 'assets/icons/V3';
const { Option } = Select;
import { withEntityData } from 'HOCs/EntityData';

function MultiSelect({
  path,
  value,
  source,
  onChange,
  className,
  options,
  label,
  showArrow,
  allowClear,
  maxTagCount,
  ...rest
}) {
  const handleOnChange = value => {
    onChange && onChange(value, path);
  };

  const onSelect = triggerdValue => {
    const optionsValues = options.map(opt => opt.value);

    if (triggerdValue === 'All') {
      onChange([...optionsValues], path);
    } else if (value.length + 2 === optionsValues.length) {
      onChange([...optionsValues], path);
    } else {
      onChange([...value, triggerdValue], path);
    }
  };

  const onDeselect = triggerdValue => {
    if (triggerdValue === 'All') {
      onChange([], path);
    } else {
      let newValues = [];
      value.forEach(val => {
        if (val === 'All') return;
        if (val === triggerdValue) return;
        newValues.push(val);
      });
      onChange(newValues, path);
    }
  };

  const inputValue = (value !== undefined ? value : _.get(path, source)) || [];

  return (
    <div>
      {label && (
        <label className="fs-md fw-600 ff-roboto py-5 inline-block text-white">{label}</label>
      )}
      <Select
        value={inputValue}
        className={`MultiSelect  ${className}`}
        mode="multiple"
        onChange={handleOnChange}
        onSelect={onSelect}
        onDeselect={onDeselect}
        optionLabelProp="label"
        // open={true}
        dropdownStyle={{
          background: '#444444',
          border: '1px solid white',
          borderRadius: '6px',
        }}
        popupClassName={'DropDown'}
        maxTagCount={maxTagCount}
        {...rest}
      >
        {options.map(option => (
          <Option
            className="v3-option"
            key={option.value}
            value={option.value}
            label={option.title}
          >
            <div className="select-item">
              <div className="check-mark-wrapper">
                <CheckSVG className="check-mark" />
              </div>
              <span className="fs-md">{option.title}</span>
            </div>
          </Option>
        ))}
      </Select>
    </div>
  );
}

MultiSelect.defaultProps = {
  onChange: () => {},
  options: [],
  source: {},
  value: [],
  showArrow: true,
  allowClear: true,
  maxTagCount: 'responsive',
};

MultiSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  source: PropTypes.object,
};

export default withEntityData(MultiSelect);
