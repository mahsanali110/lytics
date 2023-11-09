import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Row, Form } from 'antd';
import _omit from 'lodash/omit';
import { message as antMessage } from 'antd';
import PicturesWall from '../../ImageUpload';
import { Button, Select } from 'components/Common';
import companyActions from 'modules/company/action';
import '../../FormStyles.scss';
import { set } from 'lodash';

const ProgramNameForm = () => {
  const dispatch = useDispatch();
  const { formDetails, associations } = useSelector(state => state.companyReducer);
  // const [association, setAssociation] = useState(formDetails.associationId);
  const { formType } = useSelector(state => state.settingsReducer);

  const [companyRecord, setCompanyRecord] = useState({ ...formDetails });
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(companyActions.resetFormDetails());
      // setAssociation('');
      setFileList([]);
    }
    if (formType === 'EDIT' && formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formType]);

  useEffect(() => {
    setCompanyRecord({ ...formDetails });
    if (formDetails.logoPath) setFileList([{ url: formDetails.logoPath }]);
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setCompanyRecord({ ...companyRecord, [name]: value });
  };

  const handleNumberChanges = event => {
    let { name, value } = event.target;
    const numValue = parseInt(value);
    if (isNaN(numValue)) return antMessage.error('This field accepts only number values', 2);
    setCompanyRecord({ ...companyRecord, [name]: value });
  };

  const validateInput = (str, name) => {
    const regex = /^[ a-zA-Z0-9-_]+$/;
    if (!regex.test(str)) {
      antMessage.error(`"${name}" is not allowed to have special characters`, 2);
      return false;
    }
  };

  const handleUpdate = () => {
    if (!companyRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!companyRecord.contact) {
      antMessage.error('"Contact" is not allowed to be empty', 2);
      return false;
    } else if (!companyRecord.companyId) {
      antMessage.error('"Company ID" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else if (validateInput(companyRecord.name, 'Name') === false) return false;
    else {
      const form = new FormData();
      form.append('name', companyRecord.name);
      form.append('contact', companyRecord.contact);
      form.append('companyId', companyRecord.companyId);
      form.append('maxUsers', companyRecord.maxUsers);
      form.append('maxTopics', companyRecord.maxTopics);
      form.append('maxTvChannels', companyRecord.maxTvChannels);
      form.append('maxPrints', companyRecord.maxPrints);
      form.append('maxWebsites', companyRecord.maxWebsites);
      form.append('maxSocialMedia', companyRecord.maxSocialMedia);
      form.append('maxOnlineVideos', companyRecord.maxOnlineVideos);
      form.append('maxKeyWords', companyRecord.maxKeyWords);
      // form.append('logoPath', '');
      if (fileList[0]?.originFileObj) form.append('logoPath', fileList[0]?.originFileObj);
      dispatch(companyActions.updateCompany.request({ companyId: companyRecord.id, data: form }));
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = () => {
    if (!companyRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!companyRecord.contact) {
      antMessage.error('"Contact" is not allowed to be empty', 2);
      return false;
    } else if (!companyRecord.companyId) {
      antMessage.error('"Company ID" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else if (validateInput(companyRecord.name, 'Name') === false) return false;
    else {
      const form = new FormData();
      form.append('name', companyRecord.name);
      form.append('contact', companyRecord.contact);
      form.append('companyId', companyRecord.companyId);
      form.append('maxUsers', companyRecord.maxUsers);
      form.append('maxTopics', companyRecord.maxTopics);
      form.append('maxTvChannels', companyRecord.maxTvChannels);
      form.append('maxPrints', companyRecord.maxPrints);
      form.append('maxWebsites', companyRecord.maxWebsites);
      form.append('maxSocialMedia', companyRecord.maxSocialMedia);
      form.append('maxOnlineVideos', companyRecord.maxOnlineVideos);
      form.append('maxKeyWords', companyRecord.maxKeyWords);
      form.append('logoPath', '');
      if (fileList[0]?.originFileObj) form.append('logoPath', fileList[0]?.originFileObj);
      dispatch(companyActions.addCompany.request(form));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Compnay' : 'Edit Compnay'}</h2>
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
                type="text"
                value={companyRecord.name}
                onChange={handleChange}
                className="form-input"
                maxLength="32"
              />
            </Form.Item>

            <Form.Item label="Company ID" required>
              <Input
                name="companyId"
                type="number"
                value={companyRecord.companyId}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Contact" required>
              <Input
                name="contact"
                type="number"
                value={companyRecord.contact}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="form-row" style={{ paddingLeft: '60px', paddingTop: '40px' }}>
          <Col className="form-column" span={24}>
            <span className="threshold-title">Threshold</span>
          </Col>
        </Row>
        <Row className="form-row" style={{ paddingLeft: '60px', paddingTop: '20px' }}>
          <Col className="form-column" span={5}>
            <Form.Item label="Max Users">
              <Input
                name="maxUsers"
                type="number"
                value={companyRecord.maxUsers}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Max Topics">
              <Input
                name="maxTopics"
                type="number"
                value={companyRecord.maxTopics}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Max TV Channels">
              <Input
                name="maxTvChannels"
                type="number"
                value={companyRecord.maxTvChannels}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Max Print">
              <Input
                name="maxPrints"
                type="number"
                value={companyRecord.maxPrints}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="form-row" style={{ paddingLeft: '60px', paddingTop: '20px' }}>
          <Col className="form-column" span={5}>
            <Form.Item label="Max Websites">
              <Input
                name="maxWebsites"
                type="number"
                value={companyRecord.maxWebsites}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Max Social Media">
              <Input
                name="maxSocialMedia"
                type="number"
                value={companyRecord.maxSocialMedia}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Max TV Online Videos">
              <Input
                name="maxOnlineVideos"
                type="number"
                value={companyRecord.maxOnlineVideos}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Max Keywords">
              <Input
                name="maxKeyWords"
                type="number"
                value={companyRecord.maxKeyWords}
                onChange={handleChange}
                className="form-input"
                maxLength="200"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProgramNameForm;
