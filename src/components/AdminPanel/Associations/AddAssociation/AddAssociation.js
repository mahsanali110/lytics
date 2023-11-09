import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Row, Form } from 'antd';
import { message as antMessage } from 'antd';
import _omit from 'lodash/omit';
import '../../FormStyles.scss';
import { Image, Button } from 'components/Common';
import associationsActions from 'modules/associations/actions';
import PicturesWall from '../../ImageUpload';

const Association = () => {
  const dispatch = useDispatch();
  const { formDetails } = useSelector(state => state.associationsReducer);
  const { formType } = useSelector(state => state.settingsReducer);
  const [associationRecord, setAssociationRecord] = useState({ ...formDetails });
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(associationsActions.resetFormDetails());
      setFileList([]);
    }
    if (formType === 'EDIT' && formDetails.logoPath) setFileList([{ url: formDetails.logoPath }]);
  }, [formType]);

  useEffect(() => {
    setAssociationRecord({ ...formDetails });
    if (formDetails.logoPath) setFileList([{ url: formDetails.logoPath }]);
  }, [formDetails]);

  const handleChange = e => {
    const { name, value } = e.target;
    setAssociationRecord({ ...associationRecord, [name]: value });
  };

  const handleUpdate = () => {
    if (!associationRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!associationRecord.slogan) {
      antMessage.error('"Slogan" is not allowed to be empty', 2);
      return false;
    } else if (associationRecord.shortform) {
      antMessage.error('"Shortform" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
    } else {
      associationRecord.logoPath = fileList[0].thumbUrl;
      dispatch(
        associationsActions.updateAssociation.request({
          associationId: formDetails.id,
          data: { ..._omit(associationRecord, ['id']) },
        })
      );
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = () => {
    if (!associationRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!associationRecord.slogan) {
      antMessage.error('"Slogan" is not allowed to be empty', 2);
      return false;
    } else if (associationRecord.shortform) {
      antMessage.error('"Shortform" is not allowed to be empty', 2);
      return false;
    } else if (fileList.length === 0) {
      antMessage.error('"Logo" is not allowed to be empty', 2);
    } else {
      associationRecord.logoPath = fileList[0].thumbUrl;
      dispatch(associationsActions.addAssociation.request(associationRecord));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Association' : 'Edit Association'}</h2>
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

          <Col className="form-column" span={6}>
            <Form.Item label="Name" required>
              <Input
                type="text"
                className="form-input"
                name="name"
                value={associationRecord.name}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
            <Form.Item label="Shortform" required>
              <Input
                type="text"
                size="small"
                className="form-input"
                name="shortForm"
                value={associationRecord.shortForm}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
          </Col>
          <Col className="form-column" span={6}>
            <Form.Item label="Slogan" required>
              <Input
                type="text"
                className="form-input"
                name="slogan"
                value={associationRecord.slogan}
                onChange={handleChange}
                maxLength="32"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Association;
