import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';

import _ from 'lodash';

import './Login.scss';

import loginLogo from 'assets/images/Lytics_logo_W 1.png';
import { LOGIN } from 'constants/hotkeys';
import authActions from 'modules/auth/actions';
import AclService from 'services/acl';
import ForgetPassword from 'components/ForgetPassword';
import { APP_RELEASE_VERSION, MAX_PASSWORD_LENGTH_WHEN_LOGIN } from 'constants/index';
import { makeUserAccess } from 'modules/common/utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { StringInput, PasswordInput, Checkbox, Button } from 'V3/components/Common';
import EntityData from 'HOCs/EntityData';

function Login({ history }) {
  const [userLogin, setUserLogin] = useState({ email: '', password: '', isChecked: false });
  const dispatch = useDispatch();
  const { isLoggedIn, user, error } = useSelector(state => state.authReducer);
  const [ErrorCheck, setErrorCheck] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);

  useEffect(() => {
    if (error === 'Request failed with status code 400') {
      if (confirm('User Already Logged In!\nYou want to forcefully Login?')) {
        login('true');
      } else {
        let txt = 'You pressed Cancel!';
      }
    }
  }, [error]);

  useEffect(() => {
    if (error === 'Request failed with status code 401') {
      setErrorCheck('The username or password you entered is incorrect.');
    }
  }, [error]);

  useEffect(() => {
    if (isLoggedIn) {
      let aclService;
      if (user.role.toLowerCase() === 'client' && user?.pannels) {
        const userAccess = makeUserAccess(user.pannels);
        aclService = new AclService(user.role.toLowerCase(), userAccess);
      } else {
        aclService = new AclService(user.role.toLowerCase());
      }
      history.push(aclService.landingPage);
    }
  }, [isLoggedIn]);

  const checkPasswordLength = password => {
    return password.length <= MAX_PASSWORD_LENGTH_WHEN_LOGIN;
  };

  const login = forced => {
    dispatch(
      authActions.signin.request({
        email: userLogin.email,
        password: userLogin.password,
        isChecked: userLogin.isChecked,
        forced,
      })
    );
  };

  const handleForgot = () => {
    setForgotPass(true);
  };

  // useEffect(() => {
  //   dispatch(authActions.checkInternet.request(true));
  // }, []);

  const handleClick = () => {
    const isPasswordLessThanLimit = checkPasswordLength(userLogin.password);
    if (!isPasswordLessThanLimit) {
      return antMessage.error(
        `Password must not be more than ${MAX_PASSWORD_LENGTH_WHEN_LOGIN} characters!`,
        3
      );
    }
    login('false');
  };

  useHotkeys(
    LOGIN,
    e => {
      e.preventDefault();
      handleClick();
    },
    [handleClick]
  );

  const handleOnChange = (value, path) => {
    const userInfo = { ...userLogin };
    const updatedUserInfo = _.set(userInfo, path, value);
    setUserLogin(updatedUserInfo);
    setErrorCheck('');
  };
  return (
    <section className="Login">
      <div className="v3-login-wrapper">
        {forgotPass ? (
          <ForgetPassword />
        ) : (
          <div className="v3-login-content">
            <div className="logo-wrapper center-content mb-30">
              <img width="88px" src={loginLogo} />
            </div>
            <Form onFinish={handleClick}>
              <EntityData onChange={handleOnChange} source={userLogin}>
                <StringInput
                  className="mb-15"
                  placeholder="Email"
                  type="email"
                  path={'email'}
                  label="Email"
                  maxLength="64"
                  required
                />
                <div className="mb-15">
                  <PasswordInput
                    path={'password'}
                    placeholder="Password"
                    label="Password"
                    status="error"
                    maxLength="64"
                    required
                  />
                  {ErrorCheck &&
                  ErrorCheck === 'The username or password you entered is incorrect.' ? (
                    <span className="error-msg">{ErrorCheck}</span>
                  ) : null}
                </div>
                <div className="d-flex justify-between mb-30">
                  <Checkbox path="isChecked" label={'Stay Signed In'} />
                  <span
                    className="fs-md fw-600 text-imperial-red cursor-pointer inline-block"
                    onClick={handleForgot}
                  >
                    Forgot Password ?
                  </span>
                </div>
              </EntityData>
              <Button htmlFor="submit">Login</Button>
            </Form>
            <div className="center-content ff-roboto fs-sm mt-30"> {APP_RELEASE_VERSION}</div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;
