import React from 'react'
import { Row, Col } from 'antd';
import PrintEditor from './Editor1';
import PrintSegment from '../SegmentBlock/Segment';

function PrintBlock() {
  return (
    <div>
      <Row gutter={24}>
        <Col span={8}>
      <PrintEditor/>
      </Col>
      <Col span={16}>
      <PrintSegment/>
      </Col>
      </Row>
    </div>
  )
}

export default PrintBlock