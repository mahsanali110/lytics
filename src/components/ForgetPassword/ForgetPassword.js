import React from 'react';
import { Input, Form, Button, Typography } from 'antd';
import { message as antMessage, Spin } from 'antd';
import { useEffect, useState } from 'react';
import OTPInput, { ResendOTP } from 'otp-input-react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Countdown, { zeroPad } from 'react-countdown';
import authActions from 'modules/auth/actions';
import './ForgetPassword.scss';
import ImsLogo from 'assets/icons/Lytics_logo.svg';
import CreateNewPassword from 'components/CreateNewPassword';
const { Text } = Typography;
const ForgetPassword = ({ history }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);
  const authData = useSelector(state => state.authReducer);
  const [OTP, setOTP] = useState('');
  const [chkOTP, setchkOTP] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [forgetPassEmail, setForgetPassEmail] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const handleClick = () => {
    setShowLoader(true);
    dispatch(
      authActions.forgotPassword.request({
        email: forgetPassEmail,
      })
    );
  };
  // if(startTimer === true){
  // setShowResendButton(true);
  // }
  const handleChange = event => {
    const { value } = event.target;
    setForgetPassEmail(value);
  };
  console.log(OTP)
  useEffect(() => {
    if (authData?.data?.toString().length >= 4) {
      setShowLoader(false);
      setStartTimer(true);
      setTimeout(() => {
        setStartTimer(false);
        authData.data = null;
      }, 60000);
    }
  }, [authData]);
  console.log(authData);
  useEffect(() => {
    if (OTP.length >= 4) {
      console.log(authData?.data);
      if (OTP == authData?.data) {
        setchkOTP(true);
      } else {
        antMessage.error('Kindly enter correct OTP');
      }
    }
  }, [OTP]);
  console.log(chkOTP);
  console.log(Date.now() + 60000);
  // const renderButton = (buttonProps) => {
  //   return <button {...buttonProps}>Resend</button>;
  // };
  const renderButton = () => React.Fragment;
  const renderTime = (remainingTime) => {
    if(remainingTime === 0){
      setStartTimer(false);
    }
    return <span
    style={{
      height: '30px',
      color: '#E7223C',
      fontSize: '2.5rem',
      margin: '20px',
    }}>
      {/* {remainingTime} */}
      {zeroPad(0)}:{zeroPad(remainingTime)}
      </span>
  };
  useEffect(() => {
    renderTime(60);
  },[startTimer])
  return (
    <>
      {chkOTP && forgetPassEmail.length > 0 ? (
        <CreateNewPassword forgetPassEmail={forgetPassEmail} />
      ) : (
        <>
          <img src={ImsLogo} alt="logo" className="login-logo" />
          <div className="forgetpass-form-format">
            <Link to="/login">
              <Text
                className="forgetpass-back-to-login"
                onClick={() => {
                  setStartTimer(false);
                  authData.data = null;
                }}
              >
                BACK TO LOGIN
              </Text>
            </Link>
          </div>
          <div className="forgetpass-page-wrapper">
            <Form onFinish={handleClick}>
              <div className="forgetpass-wrapper">
                <div className="title">
                  <Text>Forgot Your Password?</Text>
                </div>
                <span className="text">
                  Enter Your Registered Email Below To Receive Password Reset Code
                </span>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="form-input-field"
                  name="forgetPassEmail"
                  value={forgetPassEmail}
                  // onEnter={()=>
                  // {
                  //   if(forgetPassEmail.length>0)
                  //         {
                  //         setStartTimer(true);
                  //         setShowResendButton(true);
                  //         } 
                  // }}
                  onKeyDown={(e)=>{
                    if(e.key === 'Enter')
                    {
                      if(forgetPassEmail.length>0)
                              {
                              setStartTimer(true);
                              setShowResendButton(true);
                              handleClick();
                              } 
                    }
                  }}
                  required
                  onChange={handleChange}
                />
                <div className="forgetpass-button-div">
                  <Button type="primary" htmlType="submit" className="forgetpass-form-button" disabled={startTimer}>
                    {showLoader ? (
                      <LoadingOutlined
                        style={{
                          fontSize: 24,
                        }}
                        spin
                      />
                    ) : (
                      <div
                        onClick={() => {
                          if(forgetPassEmail.length>0)
                          {
                          setStartTimer(true);
                          setShowResendButton(true);
                          handleClick();
                          }
                        }}
                      >
                        { showResendButton ? 'Resend Code' : 'Send Code' }
                      </div>
                    )}
                  </Button>
                </div>
                {/* <div className="forgetpass-form-format">
                  <Text className="forgetpass-forget-password">ENTER CODE</Text>
                </div> */}
              </div>
            </Form>
            <OTPInput
              value={OTP}
              onChange={setOTP}
              OTPLength={4}
              otpType="number"
              disabled={false}
              className="OTP-btn"
              inputClassName="OTP-inner"
            />
             <div className="forgetpass-form-format">
                  <Text className="forgetpass-forget-password">ENTER CODE</Text>
            </div>
            {startTimer ? (
              <ResendOTP renderTime={renderTime} renderButton={renderButton}/>
            ): (<></>)}
            {/* <div className="forgetpass-form-format">
                  <Text className="forgetpass-forget-password">ENTER CODE</Text>
            </div> */}
            {/* // <ResendOTP renderTime={renderTime} renderButton={renderButton}/> */}
            {/* {startTimer ? (
              <>
                <Countdown
                  date={Date.now() + 60000}
                  renderer={({ minutes, seconds }) => (
                    <span
                      style={{
                        height: '30px',
                        color: '#E7223C',
                        fontSize: '2.5rem',
                        margin: '20px',
                      }}
                    >
                      {zeroPad(minutes)}:{zeroPad(seconds)}
                    </span>
                  )}
                />
              </>
            ) : (
              <></>
            )} */}
          </div>
        </>
      )}
    </>
  );
};

export default ForgetPassword;
