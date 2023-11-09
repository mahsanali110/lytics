import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { Button } from '../';

function UploadFile({ onChange, ...rest }) {
  return (
    <div>
      <Upload onChange={onChange} customRequest={() => {}} {...rest}>
        <Button icon={UploadOutlined}>Import Video</Button>
      </Upload>
    </div>
  );
}

export default UploadFile;
