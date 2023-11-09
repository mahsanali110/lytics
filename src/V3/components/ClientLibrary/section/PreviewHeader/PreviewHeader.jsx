import React from 'react';

import './PreviewHeader.scss';

import { CloseSVG } from 'assets/icons/V3';

function PreviewHeader({ onClose }) {
  const handleShowPreview = () => {
    onClose(false);
  };
  return (
    <div className="PreviewHeader">
      <span className="fs-lg fw-600">Preview</span>
      <CloseSVG className="cursor-pointer" onClick={handleShowPreview} />
    </div>
  );
}

PreviewHeader.defaultProps = {
  onClose: () => {},
};

export default PreviewHeader;
