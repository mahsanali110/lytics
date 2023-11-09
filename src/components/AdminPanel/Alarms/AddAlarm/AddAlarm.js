import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Input, InputNumber, Row } from 'antd';
import { Button, Select } from 'components/Common';
import alarmActions from 'modules/alarms/actions';
import '../../FormStyles.scss';
import _omit from 'lodash/omit';
import { message as antMessage } from 'antd';

const AlarmForm = () => {
  const dispatch = useDispatch();
  const { formDetails } = useSelector(state => state.alarmReducer);
  const { formType } = useSelector(state => state.settingsReducer);
  const [alarm, setAlarm] = useState({ ...formDetails });

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(alarmActions.resetFormDetails());
    }
  }, [formType]);

  useEffect(() => {
    setAlarm({ ...formDetails });
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setAlarm({ ...alarm, [name]: value });
  };

  const languages = [
    { title: 'English', value: 'English' },
    { title: 'Urdu', value: 'Urdu' },
  ];

  const handleUpdate = () => {
    if (!alarm.thresholdProgramme) {
      antMessage.error('"Threshold/Program" is not allowed to be empty', 2);
      return false;
    } else if (!alarm.thresholdDay) {
      antMessage.error('"Threshold/Day" is not allowed to be empty', 2);
      return false;
    } else if (!alarm.language) {
      antMessage.error('"Language" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(
        alarmActions.updateAlarm.request({
          alarmId: alarm.id,
          data: { ..._omit(alarm, ['isEnabled', 'queryWord', 'id']) },
        })
      );
    }
  };
  const handleSave = () => {
    if (!alarm.queryWord) {
      antMessage.error('"Query String" is not allowed to be empty', 2);
      return false;
    } else if (!alarm.thresholdProgramme) {
      antMessage.error('"Threshold/Program" is not allowed to be empty', 2);
      return false;
    } else if (!alarm.thresholdDay) {
      antMessage.error('"Threshold/Day" is not allowed to be empty', 2);
      return false;
    } else if (!alarm.language) {
      antMessage.error('"Language" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(alarmActions.addAlarm.request(alarm));
    }
  };

  return (
    <div className="admin-panel-style add-alarm">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Alarm' : 'Edit Alarm'}</h2>
          </Col>
          <Col span={2} offset={7}>
            <Button
              variant="secondary"
              onClick={() => {
                formType === 'ADD' ? handleSave() : handleUpdate();
              }}
            >
              {formType === 'ADD' ? 'SAVE' : 'UPDATE'}
            </Button>
          </Col>
        </Row>
        <Row align="middle" className="form-row">
          <Col span={2} />
          <Col className="form-column" span={6}>
            <Form.Item label="Query String" required>
              <Input
                disabled={formType === 'EDIT' ? true : false}
                className="form-input"
                name="queryWord"
                value={alarm.queryWord}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Threshold/Program" required>
              <InputNumber
                className="form-input number-input"
                name="thresholdProgramme"
                min={1}
                size="small"
                value={alarm.thresholdProgramme}
                maxLength="50"
                onChange={value => setAlarm({ ...alarm, thresholdProgramme: value })}
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Threshold/Day" required>
              <InputNumber
                className="form-input number-input"
                name="thresholdDay"
                min={1}
                value={alarm.thresholdDay}
                onChange={value => setAlarm({ ...alarm, thresholdDay: value })}
                maxLength="50"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row align="middle" className="form-row">
          <Col span={2} />
          <Col className="form-column" span={6}>
            <Form.Item label="Language" required>
              <Select
                size="large"
                name="language"
                value={alarm.language}
                onChange={value => setAlarm({ ...alarm, language: value })}
                size="small"
                options={languages}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AlarmForm;
