import PropTypes from 'prop-types';
import { Select } from 'antd';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Select.scss';

const { Option } = Select;

const IMSSelect = ({
  SelectAll,
  // setState,
  getSelectAll,
  onChange,
  mode,
  onSearch,
  placeholder,
  options,
  optionSort,
  ...rest
}) => {
  let _options = [...options];
  _options = optionSort ? _options.sort((a, b) => a.title.localeCompare(b.title)) : _options;
  return mode !== 'multiple' ? (
    <Select
      suffixIcon={<DownOutlined style={{ color: 'white' }} />}
      showSearch
      getPopupContainer={trigger => trigger.parentNode}
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      allowClear
      filterOption={(input, option) => {
        return (
          option.children.props.children[0].props.children
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      }}
      {...rest}
    >
      {_options.map((option, key) => {
        let display = option.display ? option.display : 'none';
        return (
          <Option key={key} value={option.value}>
            <div className="title-wrapper">
              <span className="title">{option.title}</span>
              <span className="title-icon" style={{ display: display }}>
                <FontAwesomeIcon icon={faCheck} size="sm" />
              </span>
            </div>
          </Option>
        );
      })}
    </Select>
  ) : (
    <Select
      mode={mode}
      suffixIcon={<DownOutlined style={{ color: 'white' }} />}
      showSearch
      getPopupContainer={trigger => trigger.parentNode}
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      allowClear
      filterOption={(input, option) => {
        return (
          option.children.props.children[0].props.children
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        );
      }}
      {...rest}
    >
      {options.length > 0 ? (SelectAll ? options.unshift(SelectAll) : null) : null}
      {options.map((option, key) => {
        let display = option.display ? option.display : 'none';
        return (
          <>
            <Option key={key} value={option.value}>
              {option.title === 'All' ? (
                <div className="title-wrapper" style={{ borderBottom: '1px solid white' }}>
                  <span className="title">{option.title}</span>
                  <span className="title-icon" style={{ display: display }}>
                    <FontAwesomeIcon icon={faCheck} size="sm" />
                  </span>
                </div>
              ) : (
                <div className="title-wrapper">
                  <span className="title">{option.title}</span>
                  <span className="title-icon" style={{ display: display }}>
                    <FontAwesomeIcon icon={faCheck} size="sm" />
                  </span>
                </div>
              )}
            </Option>
          </>
        );
      })}
    </Select>
  );
};

const numberOrString = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

IMSSelect.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: numberOrString,
      title: numberOrString,
    })
  ),
  optionSort: PropTypes.bool,
};

IMSSelect.defaultProps = {
  options: [],
  onSearch: () => {},
  optionSort: true,
};

export default IMSSelect;
