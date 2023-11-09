import React from 'react';
import { Input, Form, Button, Typography, OTPInput } from 'antd';
import { message as antMessage } from 'antd';
import { useEffect, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import authActions from 'modules/auth/actions';
import './CreateNewPassword.scss';
import loginTopLogo from 'assets/images/loginTopLogo.png';
const { Text } = Typography;
function CreateNewPassword({ forgetPassEmail }) {
  const dispatch = useDispatch();
  const UpperCase = /(?=.*?[A-Z])/;
  const LowerCase = /(?=.*?[a-z])/;
  const Digit = /(?=.*?[0-9])/;
  const Special = /(?=.*?[#?!@$%^&*-])/;
  const initialValues = {
    NewPassword: '',
    repeatNewPassword: '',
  };
  // const openNotification = () => {
  //   notification.open({
  //     message: `Password doesn't match`,
  //     style: {
  //       width: 300,
  //     },
  //   });
  // };
  const [newPassword, setNewPassword] = useState(initialValues);
  const [visibleInput1, setVisibleInput1] = useState(false);
  const [visibleInput2, setVisibleInput2] = useState(false);
  const handleClick = () => {
    if (
      newPassword.NewPassword === newPassword.repeatNewPassword &&
      newPassword.NewPassword.length >= 8 &&
      newPassword.NewPassword.match(UpperCase) &&
      newPassword.NewPassword.match(LowerCase) &&
      newPassword.NewPassword.match(Digit) &&
      newPassword.NewPassword.match(Special)
    ) {
      dispatch(
        authActions.resetPassword.request({
          email: forgetPassEmail,
          newPassword: newPassword.NewPassword,
        })
      );
      setUserResetPassword({ NewPassword: '', repeatNewPassword: '' });
    } else {
      if (newPassword.NewPassword !== newPassword.repeatNewPassword) {
        antMessage.error('Password Should be match');
      } else if (!newPassword.NewPassword.match(UpperCase)) {
        antMessage.error('Password Should contain atleast one uppercase letter');
      } else if (!newPassword.NewPassword.match(LowerCase)) {
        antMessage.error('Password Should contain atleast one lowercase letter');
      } else if (!newPassword.NewPassword.match(Digit)) {
        antMessage.error('Password Should contain atleast one digit');
      } else if (!newPassword.NewPassword.match(Special)) {
        antMessage.error('Password Should contain atleast one special character');
      } else if (newPassword.NewPassword.length < 8) {
        antMessage.error('Password Should be minimum 8 characters');
      }
      // openNotification();
    }
  };
  const handleChange = event => {
    const { name, value } = event.target;
    setNewPassword({ ...newPassword, [name]: value });
  };
  console.log(newPassword);
  return (
    <>
      <img src={loginTopLogo} alt="logo" className="login-logo" />
      <div className="forgetpass-form-format">
            <Link to="/login">
              <Text
                className="forgetpass-back-to-login"
                onClick={() => {
                  // setStartTimer(false);
                  authData.data = null;
                }}
              >
                BACK TO LOGIN
              </Text>
            </Link>
          </div>
      <div className="createPass-page-wrapper">
        <Form onFinish={handleClick}>
          <div className="createPass-wrapper">
            <div className="title">
              <Text>Create New Password</Text>
            </div>
            <Input
              type={visibleInput1 ? 'text' : 'password'}
              placeholder="Enter New Password"
              className="form-input-field"
              name="NewPassword"
              value={newPassword.NewPassword}
              onChange={handleChange}
              suffix={
                <EyeOutlined
                  style={{
                    fontSize: 16,
                    color: '#EF233C',
                  }}
                  onClick={() => {
                    setVisibleInput1(!visibleInput1);
                  }}
                />
              }
              required
            />
            <Input
              type={visibleInput2 ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="form-input-field"
              name="repeatNewPassword"
              value={newPassword.repeatNewPassword}
              onChange={handleChange}
              suffix={
                <EyeOutlined
                  style={{
                    fontSize: 16,
                    color: '#EF233C',
                  }}
                  onClick={() => {
                    setVisibleInput2(!visibleInput2);
                  }}
                />
              }
              required
            />
            <span className="text">
              Your new password must be different from previously used passwords{' '}
            </span>
            {/* <span>Your new password must be different from previously used passwords</span> */}
            <div className="createPass-button-div">
              <Button type="primary" htmlType="submit" className="createPass-form-button">
                Save Password
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default CreateNewPassword;
