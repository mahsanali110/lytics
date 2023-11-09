import React from 'react';

import './EmptyPlaceHolder.scss';

import { EmptySVG } from 'assets/icons/V3';

function EmptyPlaceHolder({ message }) {
  return (
    <div className="EmptyPlaceHolder">
      <EmptySVG />
      <span className="fs-xl fw-500">No Data Found</span>
      <span className="fs-md custom-message">{message}</span>
    </div>
  );
}

export default EmptyPlaceHolder;
