import React from 'react';

import './SearchBox.scss';

import { StringInput, SearchIcon, CrossIcon } from '../';

import { Search } from 'assets/icons/V3';

function SearchBox({ searchText, handleOnChange, handleSearch, varient }) {
  const handleFieldChange = value => {
    console.log({ value });
    handleOnChange && handleOnChange(value);
  };

  const handleCrossClick = () => {
    handleFieldChange('');
  };

  const getSuffix = () => {
    if (varient === 'secondary') return <Search />;
    return searchText ? <CrossIcon onClick={handleCrossClick} /> : <SearchIcon />;
  };
  return (
    <div className={`SearchBox ${varient}`}>
      <StringInput
        value={searchText}
        onChange={handleFieldChange}
        onPressEnter={handleSearch}
        type="text"
        className="search-box-input"
        placeholder="Search Content..."
        suffix={getSuffix()}
      />
    </div>
  );
}

export default SearchBox;
