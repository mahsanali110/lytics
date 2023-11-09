import { Row, Col } from 'antd';
import { Card, Tag } from 'components/Common';

import { SENTIMENTS, TREND_LABELS } from 'constants/options';

import './SegmentTrend.scss';

const SegmentTrend = ({ color, trend, handleClick }) => {
  return (
    <div style={{ border: `2px solid ${color}`, padding: '1px' }}>
      <Card
        style={{ paddingBottom: '0.6rem' }}
        title="Segment Trend"
        shape="square"
        bg="mid-dark"
        variant="secondary"
        content={TREND_LABELS.map(({ label, key }) => (
          <Row gutter={16} key={label}>
            <Col span={6}>
              <div className="ant-col ant-form-item-label">
                <label>{label}</label>
              </div>
            </Col>
            <Col span={18}>
              <div className="segment-tag-container" style={{ columnGap: '2px' }}>
                {SENTIMENTS.map(value => {
                  return (
                    <Tag
                      key={value}
                      text={value}
                      {...(trend[key] == value ? { variant: trend[key].toLowerCase() } : {})}
                      onClick={() => {
                        handleClick({ key, value: trend[key] == value ? '' : value });
                      }}
                    />
                  );
                })}
              </div>
            </Col>
          </Row>
        ))}
      />
    </div>
  );
};

export default SegmentTrend;
