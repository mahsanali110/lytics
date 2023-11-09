import { Typography, Row, Col } from 'antd';
import { Card, Tag } from 'components/Common';

import { SENTIMENTS, SENTIMENT_VARIANTS, TREND_LABELS } from 'constants/options';

const { Text } = Typography;

import './SegmentTrend.scss';

const SegmentTrend = ({ trend }) => {
  return (
    <Card
      title="Segment Trend"
      shape="square"
      bg="mid-dark"
      content={TREND_LABELS.map(({ label, key }) => (
        <Row gutter={16} key={label} className="mb-10">
          <Col span={16}>
            <div style={{ paddingLeft: '50px' }}>
              <Text className="text-grey small-font-size mr-10">{label}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Tag text={trend[key]} variant={trend[key] ? trend[key].toLowerCase() : 'default'} />
            </div>
          </Col>
        </Row>
      ))}
    />
  );
};

export default SegmentTrend;
