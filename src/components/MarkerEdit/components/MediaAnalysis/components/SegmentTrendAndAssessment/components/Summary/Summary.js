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

const Summary = ({ color, onChange, summary, participants, segIndex, onClick, jobID }) => {
  const [i, setI] = useState(null);

  const { statement, participant, pillar, sentiment } = summary[i] ?? {
    statement: '',
    participant: '',
    pillar: '',
    sentiment: '',
  };
  const [state, setState] = useState(statement);
  const [summaryValue, setSummaryValue] = useState('');

  useEffect(() => {
    setState(statement);
  }, [statement]);
  const setIndex = index => {
    setI(index);
  };
  const dispatch = useDispatch();
  let disArr = summary.map(sum => {
    if (sum.pillar || sum.statement || sum.sentiment) {
      return 'inline-block';
    } else {
      return 'none';
    }
  });
  return (
    <div className="summary-wrapper" style={{ border: `2px solid ${color}`, padding: '1px' }}>
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
                    options={participants.map(({ name }, index) => ({
                      title: name,
                      value: name,
                      display: disArr[index],
                    }))}
                    onChange={(value, key) => {
                      // dispatch({
                      //   type: 'UPDATE_PARTICIPANT',
                      //   payload: { value, field: 'participant', index: key.key, segIndex },
                      // });
                      // setIndex(key.key);
                    }}
                    onSelect={(value, key) => {
                      dispatch({
                        type: 'UPDATE_PARTICIPANT',
                        payload: { value, field: 'participant', index: key.key, segIndex },
                      });
                      setIndex(key.key);
                    }}
                    onClear={() => {
                      setIndex(null);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span="9">
                <Form.Item label="Pillar">
                  <Select
                    value={pillar}
                    placeholder="1"
                    size="small"
                    options={TREND_LABELS.map(({ label }) => ({ title: label, value: label }))}
                    onChange={(value, key) => {
                      if (i === null) return;
                      dispatch({
                        type: 'UPDATE_PARTICIPANT',
                        payload: { value, field: 'pillar', index: i, segIndex },
                      });
                      // onChange({ field: 'pillar', value })
                    }}
                    disabled={i === null ? true : false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span="18">
                <Form.Item label="Statement">
                  <TextArea
                    value={state}
                    // defaultValue={statement}
                    onChange={e => {
                      setState(e.target.value);
                      setSummaryValue(e.target.value);
                    }}
                    onBlur={e => {
                      if (i === null) return;
                      dispatch({
                        type: 'UPDATE_PARTICIPANT',
                        payload: { value: state, field: 'statement', index: i, segIndex },
                      });
                      // onChange({ field: 'statement', value: state })
                    }}
                    className="bg-light-grey"
                    rows={5}
                    placeholder="Participant Statements"
                    style={{ marginBottom: '10px', paddingTop: '7px' }}
                    disabled={i === null ? true : false}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span="6">
                <div className="summary-tags-wrapper">
                  <Tag
                    className="btn btn-primary"
                    onClick={() =>
                      onClick({
                        field: 'statement',
                        value: summaryValue,
                        jobID,
                        participantIndex: i,
                        loading: false,
                      })
                    }
                    style={{
                      color: 'orange',
                      text: 'white',
                      border: '1px solid',
                      borderRadius: '8px',
                      // cursor: 'pointer',
                      background:
                        'linear-gradient(257.51deg,rgba(252, 95, 69, 0.1) 1.48%,rgba(254, 153, 96, 0.1) 59.07%)',
                    }}
                    text="Sentiment"
                  />

                  {SENTIMENTS.map(value => {
                    return (
                      <Tag
                        key={value}
                        text={value}
                        {...(upperFirst(sentiment) === value
                          ? { variant: upperFirst(sentiment)?.toLowerCase() }
                          : {})}
                        style={{ width: '61.3px', height: '18px' }}
                        onClick={() => {
                          if (i === null) return;
                          dispatch({
                            type: 'UPDATE_PARTICIPANT',
                            payload: {
                              value: value == sentiment ? '' : value,
                              field: 'sentiment',
                              index: i,
                              segIndex,
                            },
                          });
                        }}
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
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  statement: PropTypes.string,
  sentiment: PropTypes.string,
  participant: PropTypes.string,
  pillar: PropTypes.string,
};

export default Summary;
