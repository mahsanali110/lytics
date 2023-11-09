import React, { forwardRef, useEffect } from 'react';

const PdfButtonHandler = forwardRef(ref => {
  useEffect(() => {
    setTimeout(() => {
      onLoadingFinished();
    }, 2000);
  }, []);

  return <div ref={ref}></div>;
});

export default PdfButtonHandler;
