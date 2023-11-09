import React from 'react';
import PropTypes from 'prop-types';

import './LibraryHeader.scss';

import { SearchBox } from 'V3/components/Common';

function LibraryHeader({ handleOnChange, handleSearch, searchText, setDrawerModel, drawerModel }) {
  ///// functions ///////
  const handleTextClick = () => {
    setDrawerModel(true);
  };
  return (
    <div className="LibraryHeader">
      <div className="search-box-container">
        <SearchBox
          handleOnChange={handleOnChange}
          handleSearch={handleSearch}
          searchText={searchText}
        />
      </div>

      <span
        className={`fw-600 fs-sm cursor-pointer inline-block ${
          drawerModel ? 'text-underline' : ''
        }`}
        onClick={handleTextClick}
        style={{ textUnderlineOffset: '0.3em' }}
      >
        Advance Search
      </span>
    </div>
  );
}

LibraryHeader.propTypes = {
  handleOnChange: PropTypes.func,
  handleSearch: PropTypes.func,
  setDrawerModel: PropTypes.func,
};

LibraryHeader.defaultProps = {
  handleOnChange: () => {},
  handleSearch: () => {},
  setDrawerModel: () => {},
};

export default LibraryHeader;
