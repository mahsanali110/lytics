import { Input, Form, Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import authActions from 'modules/auth/actions';
import './ResetPassword.scss';
import { notification } from 'antd';
import { Logo } from 'components/Common';
const { Text } = Typography;
const initialValues = {
  userOldPassword: '',
  userNewPassword: '',
  repeatUserNewPassword: '',
};
const host = window.location.origin;
const openNotification = () => {
  notification.open({
    message: `Password doesn't match`,
    style: {
      width: 300,
    },
  });
};
const ResetPassword = ({ history }) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.authReducer.user);
  const [userResetPassword, setUserResetPassword] = useState(initialValues);
  const email = user.email;

  const handleClick = () => {
    if (userResetPassword.repeatUserNewPassword === userResetPassword.userNewPassword) {
      dispatch(
        authActions.changePassword.request({
          email: email,
          newPassword: userResetPassword.userNewPassword,
          oldPassword: userResetPassword.userOldPassword,
        })
      );
      setUserResetPassword({ userNewPassword: '', repeatUserNewPassword: '', userOldPassword: '' });
    } else {
      openNotification();
    }
  };
  const handleChange = event => {
    const { name, value } = event.target;
    setUserResetPassword({ ...userResetPassword, [name]: value });
  };
  return (
    <>
      <div className="resetpassword-page-wrapper">
        <Logo />
        <Form onFinish={handleClick}>
          <div className="resetpassword-wrapper">
            <div className="title">
              <Text>Reset Password</Text>
            </div>

            <Input
              type="password"
              placeholder="Old Password"
              className="form-input-field"
              name="userOldPassword"
              value={userResetPassword.userOldPassword}
              required
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="New Password"
              className="form-input-field"
              name="userNewPassword"
              value={userResetPassword.userNewPassword}
              required
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="New Password"
              className="form-input-field"
              name="repeatUserNewPassword"
              value={userResetPassword.repeatUserNewPassword}
              required
              onChange={handleChange}
            />
            <div className="resetpassword-button-div">
              <Button type="primary" htmlType="submit" className="resetpassword-form-button">
                Reset Password
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ResetPassword;
