import React, { useState, useEffect } from 'react';
import { Form, Col, Input, Row, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import { Select } from 'components/Common';
import { dashboardOptions, reportOptions } from 'constants/options';

function Access({
  role,
  setRole,
  pannels,
  handleNestedFieldChange,
  allowedPannels,
  setAllowedPannels,
}) {
  // HOOKS
  const { rolesError, roles: allRoles } = useSelector(state => state.usersReducer);
  const rolesOptions = allRoles.map(({ roleName }) => ({ value: roleName, title: roleName }));
  const [pannelOptions, setPannelOptions] = useState(
    pannels?.map(({ label }) => ({ value: label, title: label }))
  );
  const [userDashboard, setUserDashboard] = useState('');
  const [userReport, setUserReport] = useState('');

  // EFFECTS
  useEffect(() => {
    setAllowedPannels(pannels?.filter(({ isAssigned }) => isAssigned)?.map(({ label }) => label));
  }, []);

  // FUNCTONS
  const updatePannlesObj = () => {
    const pannelsClone = [...cloneDeep(pannels)];
    pannelsClone.forEach(pannel => {
      if (allowedPannels.includes(pannel.label)) pannel.isAssigned = true;
      else pannel.isAssigned = false;
    });
    handleNestedFieldChange('', 'pannels', pannelsClone);
  };

  const updateTemplate = (field, value) => {
    const pannelsClone = [...cloneDeep(pannels)];
    pannelsClone.forEach(pannel => {
      if (pannel.label === field) pannel.template.name = value;
    });
    handleNestedFieldChange('', 'pannels', pannelsClone);
  };

  return (
    <Row align="middle" className="bordered-row">
      <Col span={24} className="heading-col">
        Access
      </Col>
      <Col span={24}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Role" required>
              <Spin spinning={rolesError} delay={500}>
                <Select
                  value={role}
                  onChange={value => setRole(value)}
                  size="small"
                  options={rolesOptions}
                />
              </Spin>
            </Form.Item>
          </Col>

          {role?.toLowerCase() === 'client' && (
            <Col span={4}>
              <Form.Item label="Permission" required>
                <Select
                  value={allowedPannels}
                  onChange={value => setAllowedPannels(value)}
                  size="small"
                  options={pannelOptions}
                  mode="multiple"
                  maxTagCount="responsive"
                  onBlur={updatePannlesObj}
                />
              </Form.Item>
            </Col>
          )}

          {/* {role?.toLowerCase() === 'client' && allowedPannels.includes('Dashboard') && (
            <Col span={4}>
              <Form.Item label="Select Dashboard" required>
                <Select
                  value={userDashboard}
                  onChange={value => {
                    setUserDashboard(value);
                    updateTemplate('Dashboard', value);
                  }}
                  size="small"
                  options={dashboardOptions.map(value => ({ value, title: value }))}
                />
              </Form.Item>
            </Col>
          )}

          {role?.toLowerCase() === 'client' && allowedPannels.includes('Report') && (
            <Col span={4}>
              <Form.Item label="Select Report" required>
                <Select
                  value={userReport}
                  onChange={value => {
                    setUserReport(value);
                    updateTemplate('Report', value);
                  }}
                  size="small"
                  options={reportOptions.map(value => ({ value, title: value }))}
                />
              </Form.Item>
            </Col>
          )} */}
        </Row>
      </Col>
    </Row>
  );
}

Access.defaultProps = {};

export default Access;
