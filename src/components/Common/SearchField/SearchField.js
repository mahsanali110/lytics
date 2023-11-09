import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import propTypes from 'prop-types';

import './SearchField.scss';

const SearchField = ({
  searchText,
  handleOnChange,
  handleSearch,
  shape,
  placeholder,
  size,
  isJobLibrary,
  extraClass,
  ...rest
}) => (
  <div className="main-search-fields-container">
    <div className={`search-field ${shape} ${extraClass}`}>
      <Input
        size={size}
        value={searchText}
        onChange={handleOnChange}
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        onPressEnter={handleSearch}
        {...rest}
      />
      {isJobLibrary ? null : <div className="bottom-border"></div>}
    </div>
  </div>
);

SearchField.defaultProps = {
  shape: '',
  extraClass: '',
  placeholder: 'Search Job',
  size: 'large',
};

export default SearchField;
