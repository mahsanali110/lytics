import React from 'react';
import { Spin, Space } from 'antd';
import './LoadingPage.scss';

export default function LoadingPage({ className }) {
  return (
    <div className={`loadingPage ${className}`}>
      {' '}
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>
  );
}
