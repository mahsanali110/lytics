import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { useState } from 'react';

import './UploadThumbnail.scss';

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const UplaodThumbnail = ({ fileList, hanldeFileChange, limit }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const uploadImage = async options => {
    const { onSuccess } = options;
    setTimeout(() => {
      onSuccess('Ok');
    }, 0);
  };
  const uploadButton = (
    <div>
      <PlusOutlined style={{ color: 'white' }} />
      <div
        style={{
          marginTop: 8,
        }}
        className="text-white ff-roboto"
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        customRequest={uploadImage}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={hanldeFileChange}
        className="lytics-upload"
      >
        {fileList.length >= limit ? null : uploadButton}
      </Upload>
      <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

UplaodThumbnail.propTypes = {
  fileList: PropTypes.array,
  hanldeFileChange: PropTypes.func,
  limit: PropTypes.number,
};

UplaodThumbnail.defaultProps = {
  fileList: [],
  hanldeFileChange: () => {},
  limit: 6,
};

export default UplaodThumbnail;
