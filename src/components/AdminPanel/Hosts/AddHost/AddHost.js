import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col, Input, Row } from 'antd';
import _omit from 'lodash/omit';
import { message as antMessage } from 'antd';

import PicturesWall from '../../ImageUpload';
import { Button } from 'components/Common';
import hostsActions from 'modules/hosts/actions';
import '../../FormStyles.scss';

const HostForms = () => {
  const dispatch = useDispatch();
  const { formDetails } = useSelector(state => state.hostsReducer);
  const { formType } = useSelector(state => state.settingsReducer);

  const [hostRecord, setHostRecord] = useState({ ...formDetails });
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(hostsActions.resetFormDetails());
      setFileList([]);
    }
    if (formType === 'EDIT' && formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formType]);

  useEffect(() => {
    setHostRecord({ ...formDetails });
    if (formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setHostRecord({ ...hostRecord, [name]: value });
  };

  const handleUpdate = () => {
    if (!hostRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!hostRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else {
      const form = new FormData();
      form.append('name', hostRecord.name);
      form.append('description', hostRecord.description);
      // form.append('photoPath', "")
      if (fileList[0]?.originFileObj) form.append('photoPath', fileList[0]?.originFileObj);
      dispatch(hostsActions.updateHost.request({ hostId: hostRecord.id, data: form }));
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = () => {
    if (!hostRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!hostRecord.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else {
      const form = new FormData();
      form.append('name', hostRecord.name);
      form.append('description', hostRecord.description);
      form.append('photoPath', '');
      if (fileList[0]?.originFileObj) form.append('photoPath', fileList[0]?.originFileObj);
      dispatch(hostsActions.addHost.request(form));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Hosts' : 'Edit Host'}</h2>
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
          <Col span={4} className="form-picture">
            <PicturesWall handleImageChange={handleImageChange} fileList={fileList} />
          </Col>
          <Col span={6} className="form-column">
            <Form.Item label="Name" required>
              <Input
                type="text"
                className="form-input"
                name="name"
                maxLength="32"
                value={hostRecord.name}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Description" required>
              <Input
                className="form-input"
                name="description"
                maxLength="200"
                value={hostRecord.description}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default HostForms;
