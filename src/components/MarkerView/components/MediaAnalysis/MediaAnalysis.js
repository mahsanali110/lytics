import { Row, Col } from 'antd';

import { ProgramInformation, SegmentTrendAndAssessment } from './components';

import './MediaAnalysis.scss';

const MediaAnalysis = () => {
  return (
    <Row gutter={16}>
      <Col span="7">
        <ProgramInformation />
      </Col>
      <Col span="17">
        <SegmentTrendAndAssessment />
      </Col>
    </Row>
  );
};

export default MediaAnalysis;
