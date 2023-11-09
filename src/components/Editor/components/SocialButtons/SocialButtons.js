import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Space, Switch, message as antMessage } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import './SocialButtons.scss';

import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';

import {
  FacebookIcon,
  Youtube2Icon,
  TwitterIcon,
  InstagramIcon,
  WhatsappIcon,
  LensIcon,
} from 'assets/icons';

function SocialButtons({
  disabled,
  handleUpdateField,
  processFields,
  programInfo,
  isClip,
  isTicker,
  isScreen,
}) {
  const { exportLoading } = useSelector(state => state.editorReducer);
  const { clipData } = useSelector(state => state.editorReducer);
  const [nestedField, setNestedField] = useState('');

  useEffect(() => {
    if (isClip) setNestedField('clipProcessFields');
    if (isTicker) setNestedField('tickerProcessFields');
    if (isScreen) setNestedField('screenProcessFields');
  }, [isClip, isTicker, isScreen]);
  return (
    <div className="social-buttons-wrapper">
      <Row gutter={8} className="social-row" justify="center">
        {/* 1st Col */}
        <Col className="first-social-col">
          <Space direction="horizontal" size="middle">
            <Switch
              key={1}
              disabled={true}
              checkedChildren={<FacebookIcon />}
              unCheckedChildren={<FacebookIcon />}
              checked={true}
            />
            <Switch
              key={2}
              disabled={!isClip}
              checkedChildren={<Youtube2Icon />}
              unCheckedChildren={<Youtube2Icon />}
              onChange={value =>
                handleUpdateField({ field: 'youtube', value: !value, nestedField })
              }
              checked={!processFields.youtube}
            />
            <Switch
              key={3}
              disabled={true}
              checkedChildren={<TwitterIcon />}
              unCheckedChildren={<TwitterIcon />}
              checked={true}
            />
            <Switch
              key={4}
              disabled={true}
              checkedChildren={<InstagramIcon />}
              unCheckedChildren={<InstagramIcon />}
              checked={true}
            />
            <Switch
              key={5}
              disabled={true}
              checkedChildren={<WhatsappIcon />}
              unCheckedChildren={<WhatsappIcon />}
              checked={true}
            />
          </Space>
        </Col>

        {/* 2nd Col */}
        <Col className="second-social-col">
          <Space direction="horizontal" size="middle">
            <Switch
              key={6}
              disabled={!programInfo.id}
              checkedChildren={<LensIcon />}
              unCheckedChildren={<LensIcon />}
              onChange={value => handleUpdateField({ field: 'lens', value: !value, nestedField })}
              checked={!processFields.lens}
            />
            <Switch
              key={7}
              disabled={
                programInfo.id && (programInfo?.isCompanyLibrary || programInfo?.isPersonalLibrary)
              }
              checkedChildren={<SaveOutlined style={{ color: 'black' }} />}
              unCheckedChildren={<SaveOutlined style={{ color: 'black' }} />}
              onChange={value => handleUpdateField({ field: 'save', value: !value, nestedField })}
              checked={!processFields.save}
            />
            <Switch
              key={8}
              disabled={disabled}
              checkedChildren={<DownloadOutlined style={{ color: 'black' }} />}
              unCheckedChildren={<DownloadOutlined style={{ color: 'black' }} />}
              onChange={value =>
                handleUpdateField({
                  field: 'download',
                  value: !value,
                  nestedField,
                })
              }
              checked={!processFields.download}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
}

SocialButtons.PropTypes = {
  disabled: PropTypes.func,
};

SocialButtons.defaultProps = {
  disabled: () => {},
};

export default SocialButtons;
