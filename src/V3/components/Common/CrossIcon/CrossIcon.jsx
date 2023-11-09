import React from 'react';

import './CrossIcon.scss';

import { CloseSVG } from 'assets/icons/V3';

function CrossIcon({ onClick }) {
  return (
    <div onClick={onClick} className="CrossIcon center-content">
      <CloseSVG />
    </div>
  );
}

CrossIcon.defaultProps = {
  onClick: () => {},
};

export default CrossIcon;
