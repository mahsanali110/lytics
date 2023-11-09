import React from 'react';

import './PreviewContent.scss';

import { getMediaPreview, getDetailsPreview } from './utils';

function PreviewContent({
  job,
  setPlayCheck,
  PlayCheck,
  setDisable,
  searchText,
  handleOnchange,
  statementFontSize,
}) {
  return (
    <div className="PreviewContent">
      <div className="media-preview">{getMediaPreview(job, setPlayCheck)}</div>
      <div className="details-preview">
        {getDetailsPreview(
          job,
          PlayCheck,
          setDisable,
          searchText,
          handleOnchange,
          statementFontSize
        )}
      </div>
    </div>
  );
}

export default PreviewContent;
