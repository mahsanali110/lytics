import React from 'react';
import PropTypes from 'prop-types';
import { Upload } from 'antd';

import './Upload.scss';

function IMSUpload({ onChange, accept, ...rest }) {
  const uploadImage = async options => {
    const { onSuccess } = options;
    setTimeout(() => {
      onSuccess('Ok');
    }, 0);
  };
  return (
    <div className="print-upload-wrapper">
      <Upload onChange={onChange} customRequest={uploadImage} accept={accept} {...rest}>
        <button className="print-upload-button">Browse</button>
      </Upload>
    </div>
  );
}

IMSUpload.PropTypes = {
  onChange: PropTypes.func,
  accept: PropTypes.string,
};

IMSUpload.defaultProps = {
  onChange: () => {},
  accept: '.jpeg, .png, .webp, JPEG, .jpg',
};

export default IMSUpload;
