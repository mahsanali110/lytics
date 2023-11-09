import { Row, Col } from 'antd';
import { Card } from '../../../Common';

import { ProgramInformation, SegmentTrendAndAssessment } from './components';

import './MediaAnalysis.scss';

const MediaAnalysis = props => {
  return (
    <Row gutter={16}>
      <Col span="7">{/* <ProgramInformation /> */}</Col>
      <Col span="17">
        <SegmentTrendAndAssessment jobID={props} />
      </Col>
    </Row>
  );
};

export default MediaAnalysis;
