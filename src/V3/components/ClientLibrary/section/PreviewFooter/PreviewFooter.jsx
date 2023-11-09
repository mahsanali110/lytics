import React from 'react';

import './PreviewFooter.scss';

import { AddSVG, RemoveSVG } from 'assets/icons/V3';
import { SearchBox } from 'V3/components/Common';

function PreviewFooter({ handleOnChange, searchText, handleFont }) {
  const increseFontSize = () => {
    handleFont(1);
  };

  const decreaseFontSize = () => {
    handleFont(-1);
  };

  return (
    <div className="PreviewFooter">
      <div className="action-buttons">
        <AddSVG onClick={increseFontSize} />
        <RemoveSVG onClick={decreaseFontSize} />
      </div>
      <div className="search-bar-wrapper">
        <SearchBox handleOnChange={handleOnChange} searchText={searchText} varient="secondary" />
      </div>
      <div className="summary-button"></div>
    </div>
  );
}

export default PreviewFooter;
