import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { Form, Input, Row, Col } from 'antd';
import { Card, Select, Tag } from 'components/Common';
import { ReloadOutlined } from '@ant-design/icons';
import { SENTIMENTS, SENTIMENT_VARIANTS } from 'constants/options';
import upperFirst from 'lodash/capitalize';

const { TextArea } = Input;

const Analysis = ({ color, onChange, scale, analyst, onClick, jobID }) => {
  const [ana, setAna] = useState(analyst);
  const [analysisValue, setAnalysisValue] = useState();

  useEffect(() => {
    setAna(analyst);
  }, [analyst]);
  return (
    <div style={{ border: `2px solid ${color}`, padding: '1px', height: '100%' }}>
      <Card
        title="Overall Segment Analysis"
        shape="square"
        bg="mid-dark"
        variant="secondary"
        content={
          <Form layout="vertical">
            <Row gutter={16}>
              <Col className="gutter-row" span="18">
                <Form.Item label="Overall Scale">
                  <Select
                    className={`${SENTIMENT_VARIANTS[upperFirst(scale)]}`}
                    value={upperFirst(scale)}
                    placeholder="Enter Here"
                    size="small"
                    onChange={value => onChange({ field: 'scale', value })}
                    options={SENTIMENTS.map(title => ({ title, value: title }))}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span="6" style={{ marginTop: '26px' }}>
                <Tag
                  className="btn btn-primary"
                  onClick={() =>
                    onClick({ field: 'scale', value: analysisValue, jobID, loading: false })
                  }
                  style={{
                    color: 'rgba(222, 172, 85, 1)',
                    float: 'right',
                    border: '1px solid',
                    borderRadius: '8px',
                    background:
                      'linear-gradient(257.51deg,rgba(222, 172, 85, 0.1) 1.48%,rgba(222, 172, 85, 0.1) 59.07%)',
                  }}
                  text="Sentiment"
                />
              </Col>
              <Col
                className="gutter-row"
                span="24"
                style={{ marginTop: '5px', paddingLeft: '0px' }}
              >
                <Form.Item label="Analyst">
                  <TextArea
                    value={ana}
                    onChange={e => {
                      setAnalysisValue(e.target.value);
                      setAna(e.target.value);
                    }}
                    onBlur={e => onChange({ field: 'analyst', value: ana })}
                    className="bg-light-grey content-segmentation-textarea"
                    rows={10}
                    placeholder="Analyst Remarks go here"
                    // style={{ marginBottom: '3.5px' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        }
      />
    </div>
  );
};

Analysis.propTypes = {
  onChange: PropTypes.func.isRequired,
  scale: PropTypes.string,
  analyst: PropTypes.string,
};

export default Analysis;
