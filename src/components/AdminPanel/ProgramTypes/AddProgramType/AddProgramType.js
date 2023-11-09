import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Input, Row } from 'antd';
import { Button, Select } from 'components/Common';
import _omit from 'lodash/omit';
import { message as antMessage } from 'antd';

import programTypesActions from 'modules/programTypes/actions';
import '../../FormStyles.scss';

import { CHANNEL_TYPE } from 'constants/strings';

const ProgramForm = () => {
  const dispatch = useDispatch();
  const { formDetails } = useSelector(state => state.programTypesReducer);
  const { formType } = useSelector(state => state.settingsReducer);
  const [programRecord, setProgramRecord] = useState({ ...formDetails });
  const channelType = CHANNEL_TYPE.map(name => ({ value: name, title: name }));

  useEffect(() => {
    if (formType === 'ADD') dispatch(programTypesActions.resetFormDetails());
  }, [formType]);

  useEffect(() => {
    setProgramRecord({ ...formDetails });
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setProgramRecord({ ...programRecord, [name]: value });
  };

  const handleSourceChange = source => {
    setProgramRecord({ ...programRecord, source });
  };
  const handleUpdate = () => {
    if (!programRecord.name) {
      antMessage.error('"Program Name" is not allowed to be empty', 2);
      return false;
    } else if (!programRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (!programRecord.source) {
      antMessage.error('"Source" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(
        programTypesActions.updateProgramType.request({
          programTypeId: formDetails.id,
          data: { ..._omit(programRecord, ['id']) },
        })
      );
    }
  };

  const handleSave = () => {
    if (!programRecord.name) {
      antMessage.error('"Program Name" is not allowed to be empty', 2);
      return false;
    } else if (!programRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (!programRecord.source) {
      antMessage.error('"Source" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(programTypesActions.addProgramType.request(programRecord));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">
              {formType === 'ADD' ? 'Add Program Type' : 'Edit Program Type'}
            </h2>
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
          <Col className="form-column" span={6}>
            <Form.Item label="Program Type" required>
              <Input
                type="text"
                className="form-input"
                name="name"
                size="small"
                value={programRecord.name}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Description" required>
              <Input
                className="form-input"
                name="description"
                size="small"
                value={programRecord.description}
                onChange={handleChange}
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Source" required>
              <Select
                name="source"
                size="small"
                value={programRecord.source}
                onChange={value => handleSourceChange(value)}
                options={channelType}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default ProgramForm;
