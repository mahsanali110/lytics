import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Row, Form } from 'antd';
import _omit from 'lodash/omit';
import { message as antMessage } from 'antd';
import PicturesWall from '../../ImageUpload';
import { Button, Select } from 'components/Common';
import guestsActions from 'modules/guests/actions';
import '../../FormStyles.scss';
import { set } from 'lodash';

const ProgramNameForm = () => {
  const dispatch = useDispatch();
  const { formDetails, associations } = useSelector(state => state.guestsReducer);
  const [association, setAssociation] = useState(formDetails.associationId);
  const { formType } = useSelector(state => state.settingsReducer);

  const [guestRecord, setGuestRecord] = useState({ ...formDetails });
  const [fileList, setFileList] = useState([]);

  const associationsOptions = associations.map(({ name }) => ({ value: name, title: name }));

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(guestsActions.resetFormDetails());
      setAssociation('');
      setFileList([]);
    }
    if (formType === 'EDIT' && formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formType]);

  useEffect(() => {
    setGuestRecord({ ...formDetails });
    setAssociation(formDetails.association);
    if (formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setGuestRecord({ ...guestRecord, [name]: value });
  };

  const handleUpdate = () => {
    if (!guestRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!association) {
      antMessage.error('"Association" is not allowed to be empty', 2);
      return false;
    } else if (!guestRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else {
      const form = new FormData();
      form.append('name', guestRecord.name);
      form.append('description', guestRecord.description);
      form.append('association', association);
      // form.append('photoPath', "");
      if (fileList[0]?.originFileObj) form.append('photoPath', fileList[0]?.originFileObj);
      dispatch(guestsActions.updateGuest.request({ guestId: guestRecord.id, data: form }));
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = () => {
    if (!guestRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!association) {
      antMessage.error('"Association" is not allowed to be empty', 2);
      return false;
    } else if (!guestRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else {
      const form = new FormData();
      form.append('name', guestRecord.name);
      form.append('description', guestRecord.description);
      form.append('association', association);
      form.append('photoPath', '');
      if (fileList[0]?.originFileObj) form.append('photoPath', fileList[0]?.originFileObj);
      dispatch(guestsActions.addGuest.request(form));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Guests' : 'Edit Guests'}</h2>
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
        <Row className="form-row">
          <Col span={4} className="form-picture" style={{ marginTop: '-12px' }}>
            <PicturesWall handleImageChange={handleImageChange} fileList={fileList} />
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Name" required>
              <Input
                name="name"
                value={guestRecord.name}
                onChange={handleChange}
                className="form-input"
                maxLength="32"
              />
            </Form.Item>
            <Form.Item label="Description" required>
              <Input
                name="description"
                value={guestRecord.description}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Association" required>
              <Select
                name="association"
                value={association}
                size="small"
                onChange={value => setAssociation(value)}
                options={associationsOptions}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProgramNameForm;
