import React, { useState, useEffect, useRef } from 'react';
import { Grid, Typography } from '@mui/material';

import './ContentWrapper.scss';

const { Text } = Typography;

function ContentWrapper({ heading, children }) {
  const [height, setHeight] = useState('');
  const element = useRef(null);

  useEffect(() => {
    calcHeight(element);
    window.addEventListener('resize', () => calcHeight(element));

    return () => {
      window.removeEventListener('resize', () => calcHeight(element));
    };
  }, [element.current, children]);

  const calcHeight = (elm) => {
    if (elm.current) {
      let newHeight = window.innerHeight - elm.current.getBoundingClientRect().top;
      setHeight(`${Math.floor(newHeight)}px`);
    }
  };

  return (
    <Grid container justify="center">
      <Grid item style={{ paddingBottom: '4px' }}>
        <Text className="text-white ff-roboto section-heading">{heading}</Text>
      </Grid>
      <div ref={element} style={{ height }} className="news-board-content-wrapper">
        <div className="content" style={{ height: '100%' }}>
          {children}
        </div>
      </div>
    </Grid>
  );
}

export default ContentWrapper;
