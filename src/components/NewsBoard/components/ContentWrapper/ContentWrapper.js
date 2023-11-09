import React, { useState, useLayoutEffect, useRef } from 'react';
import { Row, Col, Typography } from 'antd';

import './ContentWrapper.scss';

const { Text } = Typography;

function ContentWrapper({ heading, children }) {
  const [height, setHeight] = useState('');
  const element = useRef(null);

  useLayoutEffect(() => {
    calcHeight(element);
    window.addEventListener('resize', () => calcHeight(element));
  }, [element.current, children]);
  const calcHeight = elm => {
    if (elm.current) {
      let newHeight = window.innerHeight - elm.current.getBoundingClientRect().top;
      setHeight(`${Math.floor(newHeight)}px`);
    }
  };
  return (
    <>
      {' '}
      <Row justify={'center'}>
        <Col style={{ paddingBottom: '4px' }}>
          <Text className="text-white ff-roboto section-heading">{heading}</Text>
        </Col>
      </Row>
      <div ref={element} style={{ height: height }} className="news-board-content-wrapper">
        <div className="content" style={{ height: '100%' }}>
          {children}
        </div>
      </div>
    </>
  );
}

export default ContentWrapper;
