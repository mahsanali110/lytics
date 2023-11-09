import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Row, Form } from 'antd';
import { message as antMessage } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import _omit from 'lodash/omit';
import '../../FormStyles.scss';
import { Image, Button, Select } from 'components/Common';
import channelsActions from 'modules/channels/actions';
import PicturesWall from '../../ImageUpload';
import { CHANNEL_LANGUAGE, CHANNEL_REGION, CHANNEL_TYPE } from 'constants/strings';
const ChannelForm = () => {
  const dispatch = useDispatch();
  const { formDetails } = useSelector(state => state.channelsReducer);
  const [language, setChannelLanaguage] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const { formType } = useSelector(state => state.settingsReducer);
  const [record, setRecord] = useState({ ...formDetails });
  const [fileList, setFileList] = useState([]);
  const [fileListSecondary, setFileListSecondary] = useState([]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(channelsActions.resetFormDetails());
      setChannelLanaguage('');
      setRegion('');
      setFileList([]);
      setFileListSecondary([]);
    }
    if (formType === 'EDIT' && formDetails.logoPath) setFileList([{ url: formDetails.logoPath }]);
    if (formType === 'EDIT' && formDetails.secondaryLogoPath)
      setFileListSecondary([{ url: formDetails.secondaryLogoPath }]);
  }, [formType]);

  useEffect(() => {
    setRecord({ ...formDetails });
    setChannelLanaguage(formDetails.language);
    setRegion(formDetails.region);
    setType(formDetails.type);
    if (formDetails.logoPath) setFileList([{ url: formDetails.logoPath }]);
    if (formDetails.secondaryLogoPath)
      setFileListSecondary([{ url: formDetails.secondaryLogoPath }]);
  }, [formDetails]);
  const channelLangaugeOptions = CHANNEL_LANGUAGE.map(name => ({ value: name, title: name }));
  const channelRegion = CHANNEL_REGION.map(name => ({ value: name, title: name }));
  const channelType = CHANNEL_TYPE.map(name => ({ value: name, title: name }));

  const handleChange = e => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  // ! Commented when removed the channel validations
  // const validateInput = (str, name) => {
  //   const regex = /^[ a-zA-Z0-9-_()]+$/;
  //   if (!regex.test(str)) {
  //     antMessage.error(`"${name}" is not allowed to have special characters`, 2);
  //     return false;
  //   }
  // };

  const handleUpdate = () => {
    if (!record.name) {
      antMessage.error('"Channel Name" is not allowed to be empty', 2);
      return false;
    } else if (!record.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (!record.actusId) {
      antMessage.error('"Actus ID" is not allowed to be empty', 2);
      return false;
    } else if (!region) {
      antMessage.error('"Channel Region" is not allowed to be empty', 2);
      return false;
    } else if (!type) {
      antMessage.error('"Channel Type" is not allowed to be empty', 2);
      return false;
    } else if (!language) {
      antMessage.error('"Channel Language" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else {
      const form = new FormData();
      form.append('name', record.name);
      form.append('actusId', record.actusId);
      form.append('description', record.description);
      form.append('language', language);
      form.append('region', region);
      form.append('type', type);
      form.append('tickerSize', record.tickerSize);
      form.append('xaxisCrop', record.xaxisCrop);
      form.append('yaxisOffset', record.yaxisOffset);

      if (fileList[0]?.originFileObj) form.append('logoPath', fileList[0]?.originFileObj);
      if (fileListSecondary[0]?.originFileObj)
        form.append('secondaryLogoPath', fileListSecondary[0]?.originFileObj);
      dispatch(channelsActions.updateChannel.request({ channelId: record.id, data: form }));
    }
  };

  const handleImageChange = ({ fileList }, secondary = false) => {
    if (secondary) return setFileListSecondary(fileList);
    setFileList(fileList);
  };

  const handleSave = () => {
    if (!record.name) {
      antMessage.error('"Channel Name" is not allowed to be empty', 2);
      return false;
    } else if (type == 'Tv' && !record.actusId) {
      antMessage.error('"Actus ID" is not allowed to be empty', 2);
      return false;
    } else if (!record.description) {
      antMessage.error('"Description" is not allowed to be empty', 2);
      return false;
    } else if (!region) {
      antMessage.error('"Channel Region" is not allowed to be empty', 2);
      return false;
    } else if (!type) {
      antMessage.error('"Channel Type" is not allowed to be empty', 2);
      return false;
    } else if (!language) {
      antMessage.error('"Channel Language" is not allowed to be empty', 2);
      return false;
    } else if (!fileList[0]?.originFileObj) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
      return false;
    } else {
      const form = new FormData();
      form.append('name', record.name);
      form.append('actusId', record.actusId);
      form.append('description', record.description);
      form.append('language', language);
      form.append('region', region);
      form.append('type', type);
      form.append('tickerSize', record.tickerSize);
      form.append('xaxisCrop', record.xaxisCrop);
      form.append('yaxisOffset', record.yaxisOffset);
      if (fileList[0]?.originFileObj) form.append('logoPath', fileList[0]?.originFileObj);
      if (fileListSecondary[0]?.originFileObj)
        form.append('secondaryLogoPath', fileListSecondary[0]?.originFileObj);
      dispatch(channelsActions.addChannel.request(form));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Channel' : 'Edit Channel'}</h2>
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
        <Row className="form-row">
          <Col span={4} className="form-picture">
            <PicturesWall handleImageChange={handleImageChange} fileList={fileList} />
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Channel Name" required>
              <Input
                type="text"
                className="form-input"
                name="name"
                value={record.name}
                onChange={handleChange}
                maxLength="50"
              />
            </Form.Item>

            <Form.Item label="Channel Language" required>
              <Select
                name="language"
                size="small"
                value={language}
                onChange={value => setChannelLanaguage(value)}
                options={channelLangaugeOptions}
              />
            </Form.Item>
            <Form.Item label="Channel Type" required>
              <Select
                name="type"
                size="small"
                value={type}
                onChange={value => setType(value)}
                options={channelType}
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <Form.Item label="Description" required>
              <Input
                className="form-input"
                name="description"
                onChange={handleChange}
                value={record.description}
                maxLength="200"
              />
            </Form.Item>
            <Form.Item label="Channel Region" required>
              <Select
                name="region"
                size="small"
                value={region}
                onChange={value => setRegion(value)}
                options={channelRegion}
              />
            </Form.Item>
            <Form.Item label="Actus ID" required>
              <Input
                className="form-input"
                name="actusId"
                onChange={handleChange}
                value={record.actusId}
                maxLength="32"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={5}>
            <label style={{ color: '#f2f2f2' }} htmlFor="">
              Ticker Calibration
            </label>
            <div
              style={{
                border: '1px dotted #777',
                borderRadius: '10px',
                width: '100%',
                height: '175px',
                padding: '10px',
              }}
            >
              <Form.Item label="X-axis Crop" required>
                <Input
                  type="number"
                  className="form-input"
                  name="xaxisCrop"
                  onChange={handleChange}
                  value={record.xaxisCrop}
                />
              </Form.Item>
              <Form.Item label="Y-axis Offset" required>
                <Input
                  type="number"
                  className="form-input"
                  name="yaxisOffset"
                  onChange={handleChange}
                  value={record.yaxisOffset}
                />
              </Form.Item>
              <Form.Item label="Ticker Height" required>
                <Input
                  type="number"
                  className="form-input"
                  name="tickerSize"
                  onChange={handleChange}
                  value={record.tickerSize}
                />
              </Form.Item>
            </div>
          </Col>
          <Col span={4} className="form-picture">
            <PicturesWall
              handleImageChange={fileInfo => handleImageChange(fileInfo, true)}
              fileList={fileListSecondary}
              title="Secondary Logo"
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default ChannelForm;
