import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Row, Col, Form, Input } from 'antd';
import { Card, Tag, Select } from 'components/Common';

import './Summary.scss';
import { SENTIMENTS, TREND_LABELS } from 'constants/options';
import { ReloadOutlined } from '@ant-design/icons';
import upperFirst from 'lodash/capitalize';

const { TextArea } = Input;

const Summary = ({ summary }) => {
  const [i, setI] = useState(0);

  const { statement, participant, pillar, sentiment } = summary[i] ?? {
    statement: '',
    participant: '',
    pillar: '',
    sentiment: '',
  };
  const [state, setState] = useState(statement);

  useEffect(() => {
    setState(statement);
  }, [statement]);
  const setIndex = index => {
    setI(index);
  };
  const dispatch = useDispatch();
  return (
    <div className="summary-wrapper">
      <Card
        title="Segment Executive Summary"
        shape="square"
        bg="mid-dark"
        variant="secondary"
        content={
          <Form layout="vertical">
            <Row gutter={16}>
              <Col className="gutter-row" span="9">
                <Form.Item label="Participant">
                  <Select
                    value={participant}
                    placeholder="1"
                    size="small"
                    options={summary.map(({ participant }) => ({
                      title: participant,
                      value: participant,
                    }))}
                    onChange={(value, key) => {
                      setIndex(key.key);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span="9">
                <Form.Item label="Pillar">
                  <Select
                    disabled={true}
                    value={pillar}
                    placeholder="1"
                    size="small"
                    options={TREND_LABELS.map(({ label }) => ({ title: label, value: label }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span="18">
                <Form.Item label="Statement">
                  <TextArea
                    value={state}
                    className="bg-light-grey"
                    rows={5}
                    placeholder="Participant Statements"
                    style={{ marginBottom: '10px', paddingTop: '7px', pointerEvents: 'none' }}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span="6" style>
                <div className="summary-tags-wrapper">
                  {SENTIMENTS.map(value => {
                    return (
                      <Tag
                        key={value}
                        text={value}
                        {...(upperFirst(sentiment) === value
                          ? { variant: upperFirst(sentiment)?.toLowerCase() }
                          : {})}
                        style={{ width: '61.3px', height: '18px', pointerEvents: 'none' }}
                      />
                    );
                  })}
                </div>
              </Col>
            </Row>
          </Form>
        }
      />
    </div>
  );
};

Summary.propTypes = {
  name: PropTypes.string,
  statement: PropTypes.string,
  sentiment: PropTypes.string,
  participant: PropTypes.string,
  pillar: PropTypes.string,
  summary: [],
};

export default Summary;
