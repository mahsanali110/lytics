import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Input, Row, Form, Spin } from 'antd';
import _omit from 'lodash/omit';
import { message as antMessage } from 'antd';
import PicturesWall from '../../ImageUpload';
import { Button, Select } from 'components/Common';
import groupsActions from 'modules/groups/actions';
import companyActions from 'modules/company/action';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

import '../../FormStyles.scss';
import { set } from 'lodash';

const GroupForm = () => {
  const dispatch = useDispatch();
  const [companiesCount, setCompaniesCount] = useState(1);
  const { formDetails, associations } = useSelector(state => state.groupsReducer);
  const [association, setAssociation] = useState(formDetails.associationId);
  const { formType } = useSelector(state => state.settingsReducer);
  const { companies, companiesError } = useSelector(state => state.companyReducer);

  const [groupRecord, setGroupRecord] = useState({ ...formDetails });
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch(companyActions.getCompanies.request());
  }, []);

  useEffect(() => {
    if (companiesError || companiesError === networkError) {
      setCompaniesCount(prevCount => prevCount + 1);
      if (companiesCount <= errorCount) {
        setTimeout(() => {
          dispatch(companyActions.getCompanies.request());
        }, errorDelay);
      } else if (companiesError === networkError) {
        alert(`${companiesError}, Please refresh!`);
        window.location.reload();
      } else if (companiesError !== networkError) {
        alert(`${companiesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [companiesError]);

  useEffect(() => {
    if (formType === 'ADD') {
      dispatch(groupsActions.resetFormDetails());
      setAssociation('');
      setFileList([]);
    }
    if (formType === 'EDIT' && formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formType]);

  useEffect(() => {
    setGroupRecord({ ...formDetails });
    if (formDetails.photoPath) setFileList([{ url: formDetails.photoPath }]);
  }, [formDetails]);

  const handleChange = event => {
    const { name, value } = event.target;
    setGroupRecord({ ...groupRecord, [name]: value });
  };

  const handleUpdate = () => {
    if (!groupRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!groupRecord.groupId) {
      antMessage.error('"Group ID" is not allowed to be empty', 2);
      return false;
    } else if (!groupRecord.companies.length) {
      antMessage.error('"Companies" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(groupsActions.updateGroup.request({ groupId: groupRecord.id, data: groupRecord }));
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = () => {
    if (!groupRecord.name) {
      antMessage.error('"Name" is not allowed to be empty', 2);
      return false;
    } else if (!groupRecord.groupId) {
      antMessage.error('"Group ID" is not allowed to be empty', 2);
      return false;
    } else if (!groupRecord.companies.length) {
      antMessage.error('"Companies" is not allowed to be empty', 2);
      return false;
    } else {
      dispatch(groupsActions.addGroup.request(groupRecord));
    }
  };

  return (
    <div className="admin-panel-style">
      <Form size="small" layout="vertical">
        <Row className="form-title">
          <Col span={6} offset={9}>
            <h2 className="title">{formType === 'ADD' ? 'Add Group' : 'Edit Group'}</h2>
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
          <Col span={1} style={{ marginTop: '-12px' }}>
            {/* <PicturesWall handleImageChange={handleImageChange} fileList={fileList} /> */}
          </Col>
          <Col className="form-column" span={8}>
            <Form.Item label="Group Name" required>
              <Input
                name="name"
                value={groupRecord.name}
                onChange={handleChange}
                className="form-input"
                maxLength="32"
              />
            </Form.Item>
            <Form.Item label="Companies" required>
              <Spin spinning={companiesError} delay={500}>
                <Select
                  name="companies"
                  mode="multiple"
                  value={groupRecord.companies}
                  size="small"
                  onChange={val => setGroupRecord({ ...groupRecord, companies: val })}
                  options={companies.map(com => ({ title: com.name, value: com.id }))}
                />
              </Spin>
            </Form.Item>
          </Col>
          <Col className="form-column" span={8}>
            <Form.Item label="Group ID" required>
              <Input
                name="groupId"
                value={groupRecord.groupId}
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

export default GroupForm;
