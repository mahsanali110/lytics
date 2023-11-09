import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Row, Col } from 'antd';
import { Card, Select, Tag } from 'components/Common';
import { ReloadOutlined } from '@ant-design/icons';
import upperFirst from 'lodash/capitalize';

import { SENTIMENTS } from 'constants/options';

const { TextArea } = Input;

const Anchor = ({
  color,
  onChange,
  name,
  scale,
  description,
  sentiment,
  anchorOptions,
  onClick,
  jobID,
}) => {
  const [desc, setDesc] = useState(description);
  const [gistValue, setgistValue] = useState('');

  useEffect(() => {
    setDesc(description);
  }, [description]);
  // if (anchorOptions?.length > 0 && name === '') {
  // console.log(anchorOptions);
  // onChange({ value: anchorOptions[1], field: 'name' });
  // }

  return (
    <div style={{ border: `2px solid ${color}`, padding: '1px', height: '100%' }}>
      <Card
        title="Segment Anchor Particulars"
        shape="square"
        bg="mid-dark"
        variant="secondary"
        content={
          <Form layout="vertical">
            <Form.Item label="Anchor Name">
              <Select
                value={name}
                size="small"
                onChange={value => onChange({ value, field: 'name' })}
                options={anchorOptions?.map(name => ({ value: name, title: name }))}
              />
            </Form.Item>
            {/* <Form.Item label="Sentiment">
              <Select
                value={sentiment}
                size="small"
                onChange={value => onChange({ value, field: 'sentiment' })}
                options={SENTIMENTS.map(title => ({ title, value: title }))}
              />
            </Form.Item> */}
            <Form.Item label="Scale">
              <Select
                value={scale}
                size="small"
                onChange={value => onChange({ value, field: 'scale' })}
                options={SENTIMENTS.map(title => ({ title, value: title }))}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col className="gutter-row" span="18">
                <Form.Item>
                  <TextArea
                    value={desc}
                    // defaultValue={description}
                    onChange={e => {
                      setDesc(e.target.value);
                      setgistValue(e.target.value);
                    }}
                    onBlur={e => onChange({ value: desc, field: 'description' })}
                    className="bg-light-grey content-segmentation-textarea"
                    rows={8}
                    placeholder="Gist of the participants goes here"
                    style={{ marginBottom: '10px', marginTop: '10px' }}
                  />
                </Form.Item>
              </Col>

              <Col className="gutter-row" span="6">
                <div className="summary-tags-wrapper">
                  <Tag
                    className="btn btn-primary"
                    onClick={() =>
                      onClick({ field: 'sentiment', value: gistValue, jobID, loading: false })
                    }
                    style={{
                      color: 'rgba(222, 172, 85, 1)',
                      border: '1px solid',
                      borderRadius: '8px',
                      background:
                        'linear-gradient(257.51deg,rgba(222, 172, 85, 0.1) 1.48%,rgba(222, 172, 85, 0.1) 59.07%)',
                    }}
                    text="Sentiment"
                  />

                  {SENTIMENTS.map(value => (
                    <Tag
                      key={value}
                      text={value}
                      {...(upperFirst(sentiment) === value
                        ? { variant: upperFirst(sentiment).toLowerCase() }
                        : {})}
                      style={{ width: '61.3px', height: '18px' }}
                      onClick={() =>
                        onChange({ field: 'sentiment', value: value == sentiment ? '' : value })
                      }
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
        }
      />
    </div>
  );
};

Anchor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  sentiment: PropTypes.string,
  scale: PropTypes.string,
  anchorOptions: PropTypes.array,
};

export default Anchor;
