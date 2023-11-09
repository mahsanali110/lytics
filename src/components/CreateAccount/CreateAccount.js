import React, { useState } from 'react';
import { Row, Col, Form, Input } from 'antd';

import './CreateAccount.scss';

function CreateAccount() {
  const [number, setNumber] = useState();
  const [form] = Form.useForm();
  const onSubmit = formValues => {
    console.log(values);
  };
  const onNumberChange = e => {
    const newNumber = parseInt(e.target.value || '0', 10);
    if (Number.isNaN(number)) {
      return;
    }

    setNumber(newNumber);
  };
  return (
    <div className="create-account-wrapper">
      <div className="create-account-container">
        <h2 className="main-heading">Create Your Account</h2>
        <h2 className="sub-heading">Personal Details</h2>
        <Form name="register" layout="vertical" onFinish={onSubmit} size="large" scrollToFirstError>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                tooltip="What do you want others to call you?"
                rules={[
                  {
                    required: true,
                    message: 'Please input your first name!',
                    whitespace: true,
                  },
                ]}
              >
                <Input className="form-input" placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                tooltip="What do you want others to call you?"
                rules={[
                  {
                    required: true,
                    message: 'Please input your last name!',
                    whitespace: true,
                  },
                ]}
              >
                <Input className="form-input" placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className="form-group">
                <div className="label">Contact Number</div>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your phone number',
                      max: 16,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password className="form-input" placeholder="Password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password className="form-input" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default CreateAccount;
