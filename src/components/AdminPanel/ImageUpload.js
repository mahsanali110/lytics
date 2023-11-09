import { Upload, Modal, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Upload.scss';
import React, { useState } from 'react';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const PicturesWall = ({ handleImageChange, fileList, customClass, title, ...props }) => {
  const [previewVisible, setPreviewVisibile] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setpreviewTitle] = useState('');

  const uploadButton = (
    <div>
      <UserOutlined style={{ fontSize: '70px', color: '#85878E' }} />
    </div>
  );

  const handleCancel = () => {
    setPreviewImage('');

    setPreviewVisibile(false);
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisibile(true);
  };

  const uploadImage = async options => {
    const { onSuccess } = options;
    setTimeout(() => {
      onSuccess('Ok');
    }, 0);
  };

  return (
    <>
      <div className={`upload ${customClass}`}>
        <span className="upload-text">{title}</span>
        <Upload
          customRequest={uploadImage}
          className="upload-box"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleImageChange}
        >
          {fileList?.length >= 1 ? null : uploadButton}
        </Upload>
      </div>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

PicturesWall.defaultProps = {
  title: 'Upload Image',
};
export default PicturesWall;
