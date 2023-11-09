import { Input, Form, Typography, message as antMessage } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import authActions from 'modules/auth/actions';
import AclService from 'services/acl';
import { Button } from 'components/Common';
import loginImg from 'assets/images/login.png';
// import loginLogo from 'assets/images/loginLogo.png';
import loginLogo from 'assets/images/Lytics_logo_W 1.png';
import './Login.scss';
import { LOGIN } from 'constants/hotkeys';
import ForgetPassword from 'components/ForgetPassword';
import { APP_RELEASE_VERSION, MAX_PASSWORD_LENGTH_WHEN_LOGIN } from 'constants/index';
import { makeUserAccess } from 'modules/common/utils';

const { Text } = Typography;
const initialValues = {
  userEmail: '',
  userPassword: '',
};
const Login = ({ history }) => {
  const { Password } = Input;
  const dispatch = useDispatch();
  const { isLoggedIn, user, error } = useSelector(state => state.authReducer);
  const [userLogin, setUserLogin] = useState(initialValues);
  const [ErrorCheck, setErrorCheck] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);

  const handleForgot = () => {
    setForgotPass(true);
  };
  useEffect(() => {
    if (error === 'Request failed with status code 400') {
      if (confirm('User Already Logged In!\nYou want to forcefully Login?')) {
        dispatch(
          authActions.signin.request({
            email: userLogin.userEmail,
            password: userLogin.userPassword,
            isChecked,
            forced: 'true',
          })
        );
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

  // useEffect(() => {
  //   dispatch(authActions.checkInternet.request(true));
  // }, []);

  const handleClick = () => {
    const isPasswordLessThanLimit = checkPasswordLength(userLogin.userPassword);
    if (!isPasswordLessThanLimit) {
      return antMessage.error(
        `Password must not be more than ${MAX_PASSWORD_LENGTH_WHEN_LOGIN} characters!`,
        3
      );
    }
    dispatch(
      authActions.signin.request({
        email: userLogin.userEmail,
        password: userLogin.userPassword,
        isChecked,
        forced: 'false',
      })
    );
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUserLogin({ ...userLogin, [name]: value });
    setErrorCheck('');
  };

  const hanldeCheckBox = event => {
    setIsChecked(event.target.checked);
  };
  useHotkeys(
    LOGIN,
    e => {
      e.preventDefault();
      handleClick();
    },
    [handleClick]
  );
  return (
    <>
      <div className="login-wrapper-2 background-db">
        <div className="login-wrapper ">
          {forgotPass === true ? (
            <ForgetPassword />
          ) : (
            <div className="login-main-grid">
              {/* <img src={loginImg} /> */}
              <Form onFinish={handleClick}>
                <div className="input-div">
                  <img width={'300px'} src={loginLogo} />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="form-input-field"
                    name="userEmail"
                    maxLength="64"
                    value={userLogin.userEmail}
                    required
                    onChange={handleChange}
                  />
                  <Password
                    type="password"
                    id="passwordId"
                    placeholder="Password"
                    value={userLogin.userPassword}
                    className={ErrorCheck ? 'form-input-field-selected' : 'form-input-field'}
                    name="userPassword"
                    onChange={handleChange}
                    maxLength="64"
                    required
                    iconRender={visible =>
                      visible ? (
                        <EyeTwoTone style={{ color: 'white' }} />
                      ) : (
                        <EyeInvisibleOutlined style={{ color: 'white' }} />
                      )
                    }
                  />

                  {ErrorCheck &&
                  ErrorCheck === 'The username or password you entered is incorrect.' ? (
                    <span className="error-msg">{ErrorCheck}</span>
                  ) : (
                    ''
                  )}

                  <div className="login-form-format">
                    <Checkbox
                      checked={isChecked}
                      sec
                      className="login-form-checkbox"
                      onChange={hanldeCheckBox}
                    ></Checkbox>
                    <span className="stay_sign">Stay Signed In</span>
                    <span style={{ width: '27.33px', border: '1px solid #E0E0E0' }}></span>
                    <span
                      className="forgotPass-btn"
                      onClick={() => {
                        setForgotPass(true);
                      }}
                    >
                      Forgot Password?
                    </span>
                  </div>
                  <div className="login-button-div">
                    <div className="create_account">{/* Create Account */}</div>
                    <Button
                      htmlType="submit"
                      style={{
                        background: 'rgba(180, 28, 59, 0.72)',
                        border: ' 1px solid #B41C3B',
                        borderRadius: '9px',
                        border: 'none',
                        width: '115.43px',
                        height: '42px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: '16px',
                        lineHeight: '16px',
                        alignItems: 'center',
                        textAlign: 'center',
                        letterSpacing: '0.4px',
                        color: '#EDEDED',
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </div>
        <span style={{ color: 'white', margin: '20px 0px ', fontSize: '16px' }}>
          {APP_RELEASE_VERSION}
        </span>
      </div>
    </>
  );
};

export default Login;
