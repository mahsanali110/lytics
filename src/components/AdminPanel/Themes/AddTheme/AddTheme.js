import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Input, Row, message as antMessage } from 'antd';
import _omit from 'lodash/omit';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button } from 'components/Common';
import topicActions from 'modules/topic/actions';
import '../../FormStyles.scss';
import { arrayOf } from 'prop-types';
const margin = { marginTop: '10px' };
const emptySubTheme = { name: '', topic3: [{ name: '' }] };
const emptyTopic3 = { name: '' };
import InputColor from './InputColor';

const Theme = () => {
  const dispatch = useDispatch();
  const { formDetails } = useSelector(state => state.topicsReducer);
  const { formType } = useSelector(state => state.settingsReducer);
  const [topicRecord, setTopicRecord] = useState({ ...formDetails });
  const [values, setValues] = useState({ val: [] });

  useEffect(() => {
    if (formType === 'ADD') dispatch(topicActions.resetFormDetails());
  }, [formType]);

  useEffect(() => {
    setTopicRecord({ ...formDetails });
    if (formDetails.topic2.length === 0) {
      setValues({ val: [emptySubTheme] });
    } else {
      setValues({ val: formDetails.topic2 });
    }
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setTopicRecord({ ...topicRecord, [name]: value });
  };

  const isEmpty = arr => {
    let empty = false;
    arr.forEach(el => {
      if (!el.name.trim()) {
        empty = true;
      } else {
        el.topic3.forEach(el2 => {
          if (!el2.name.trim()) {
            empty = true;
          }
        });
      }
    });
    return empty;
  };

  const handleUpdate = () => {
    let newData = values.val;
    let newTopic2 = newData.filter(data => data.name !== '');
    if (!isEmpty(newData) && topicRecord.name) {
      topicRecord.topic2 = newTopic2;
      dispatch(
        topicActions.updateTopic.request({
          topicId: formDetails.id,
          data: { ..._omit(topicRecord, ['id']) },
        })
      );
    } else {
      antMessage.error('Kindly fill all fields');
    }
  };
  const handleSave = () => {
    let newData = values.val;
    let newTopic2 = newData.filter(data => data.name !== '');
    if (!isEmpty(newData) && topicRecord.name) {
      topicRecord.topic2 = newTopic2;
      dispatch(topicActions.addTopic.request(topicRecord));
    } else {
      antMessage.error('Kindly fill all fields');
    }
  };

  const handleMultiChange = (event, index) => {
    const { value } = event.target;
    let Topic2 = [...values.val];
    Topic2[index].name = event.target.value;
    setValues({ val: Topic2 });
  };

  const handleTopic3Change = (event, index, parentInd) => {
    const { value } = event.target;
    let state = [...values.val];
    let topics = state[parentInd].topic3;
    topics[index].name = event.target.value;
    state[parentInd].topic3 = [...topics];
    setValues({ val: state });
  };

  const addClick = () => {
    setValues({ val: [...values.val, { name: '', topic3: [{ name: '' }] }] });
  };
  const addTopic3 = parentInd => {
    let state = [...values.val];
    state[parentInd].topic3 = [...state[parentInd].topic3, { name: '' }];
    setValues({ val: state });
  };

  const removeClick = index => {
    let vals = [...values.val];
    vals.splice(index, 1);
    setValues({ val: vals });
  };
  const removeTopic3 = (index, parentInd) => {
    let state = [...values.val];
    state[parentInd].topic3.splice(index, 1);
    setValues({ val: state });
  };
  const createTopic3 = (arr, parentInd) => {
    return arr.map((el, index) => (
      <div key={index} style={{ display: 'flex', width: '100%' }}>
        <Input
          type="text"
          className="form-input form-input-table"
          maxLength="64"
          style={margin}
          onChange={event => handleTopic3Change(event, index, parentInd)}
          value={el.name}
        />
        <PlusCircleOutlined
          onClick={() => addTopic3(parentInd)}
          className="form-dynamic-field-plus-icon"
        />
        <MinusCircleOutlined
          onClick={arr.length <= 1 ? null : () => removeTopic3(index, parentInd)}
          className="form-dynamic-field-plus-icon"
        />
      </div>
    ));
  };

  const createInputs = () => {
    return values.val.map((el, index) => (
      <div key={index} className="form-dynamic-field">
        <tr>
          <td className="subTheme">
            <Form.Item style={{ width: '100%' }} required label="Topic 2">
              <div className="topic2-container">
                <Input
                  type="text"
                  className="form-input form-input-table"
                  maxLength="64"
                  style={margin}
                  onChange={event => handleMultiChange(event, index)}
                  value={values.val[index].name}
                />
                <PlusCircleOutlined onClick={addClick} className="form-dynamic-field-plus-icon" />
                <MinusCircleOutlined
                  onClick={values.val.length <= 1 ? null : () => removeClick(index)}
                  className="form-dynamic-field-plus-icon"
                />
              </div>
            </Form.Item>
          </td>
          <td className="subTheme topic3">
            <Form.Item label="Topic 3" required>
              {createTopic3(el.topic3, index)}
            </Form.Item>
          </td>
        </tr>
      </div>
    ));
  };
  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h3 className="title">{formType === 'ADD' ? 'Add Themes' : 'Edit Themes'}</h3>
          </Col>
          <Col span={2} offset={7}>
            <Button
              onClick={() => {
                formType === 'ADD' ? handleSave() : handleUpdate();
              }}
              variant="secondary"
            >
              {formType === 'ADD' ? 'SAVE' : 'UPDATE'}
            </Button>
          </Col>
        </Row>
        <Row className="form-row" align="middle">
          <Col span={2} />
          <Col className="form-column" span={5}>
            <Form.Item label="Topic 1" required>
              <Input
                type="text"
                className="form-input"
                name="name"
                size="small"
                value={topicRecord.name}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
          </Col>
          {/* <Col span={1} /> */}
          <Col className="form-column" span={5}>
            <Form.Item label="Description" required>
              <Input
                className="form-input"
                name="description"
                size="small"
                value={topicRecord.description}
                onChange={handleChange}
                maxLength="32"
                required
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={3}>
            <Form.Item label="Color" required>
              <InputColor
                color={topicRecord?.color}
                onChange={handleChange}
                className="form-input"
              />
            </Form.Item>
          </Col>
          <Col span={3} />
        </Row>
        <Row className="form-row" align="middle">
          <Col span={2} />
          <Col span={15} className="form-column form-column-table" style={margin}>
            <table className="theme-table">
              {/* <Form.Item required label="Topic 2"> */}
              {createInputs()}
              {/* </Form.Item> */}
            </table>
          </Col>
          <Col span={4} />
        </Row>
      </Form>
    </div>
  );
};
export default Theme;
