import React, { useState, useEffect } from 'react';
import { Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'components/Common';
import { CSVLink, CSVDownload } from 'react-csv';
import { useDispatch } from 'react-redux';
import './modal.scss';
import { jobActions } from 'modules/jobs/actions';
var Papa = require('papaparse/papaparse.min.js');
const ModelView = ({ openModal, setopenModal, jobs }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [importButtonControl, setimportButtonControl] = useState(true);

  const props = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    showUploadList: {
      showDownloadIcon: false,
    },
    onRemove: file => {
      setFileList([]);
      setimportButtonControl(true);
    },
    beforeUpload: file => {
      setFileList([file]);
      setimportButtonControl(false);
      return false;
    },
    fileList,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  useEffect(() => {
    setIsModalVisible(openModal);
  }, [openModal]);
  useEffect(() => {
    readyData();
  }, [jobs]);

  const handleOk = () => {
    setIsModalVisible(false);
    setopenModal(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setopenModal(false);
  };
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Channel Name', key: 'channel' },
    { label: 'Program Name', key: 'programName' },
    { label: 'Program Time', key: 'programTime' },
    { label: 'Online View', key: 'onlineViews' },
    { label: 'Tv Ratings', key: 'tvRatings' },
    { label: 'Web Mentions', key: 'webMentions' },
  ];
  const csvReport = {
    data: csvData,
    headers: headers,
    filename: 'JOBS.csv',
  };

  const readyData = () => {
    let jobObj = {};
    let temp = [];
    for (let i = 0; i < jobs.results.length - 1; i++) {
      jobObj = {};
      jobObj.id = jobs.results[i].id;
      jobObj.channel = jobs.results[i].channel;
      jobObj.programName = jobs.results[i].programName;
      jobObj.programTime = jobs.results[i].programTime;
      jobObj.onlineViews = jobs.results[i].impact.onlineViews;
      jobObj.tvRatings = jobs.results[i].impact.tvRatings;
      jobObj.webMentions = jobs.results[i].impact.webMentions;
      temp.push(jobObj);
    }
    setCsvData(temp);
  };

  const handleImport = () => {
    var temp = [];

    var jobObj = {};
    Papa.parse(fileList[0], {
      downlaod: true,
      headers: false,
      complete: results => {
        {
          for (let i = 1; i < results.data.length; i++) {
            jobObj = {};
            jobObj.id = results.data[i][0];
            jobObj.channel = results.data[i][1];
            jobObj.programName = results.data[i][2];
            jobObj.programTime = results.data[i][3];
            jobObj.onlineViews = results.data[i][4];
            jobObj.tvRatings = results.data[i][5];
            jobObj.webMentions = results.data[i][6];
            temp.push(jobObj);
          }
        }
        dispatch(jobActions.editBunchJobs.request(temp));
        setIsModalVisible(false);
        setopenModal(false);
      },
    });
  };
  return (
    <Modal
      className="Modal"
      width="350px"
      title=""
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{
        backgroundColor: '#3E404B',
        height: '350px',
      }}
    >
      <div className="modal-heading">
        <h3 className="modal-Heading" style={{ color: 'white' }}>
          Import File
        </h3>
      </div>
      <div className="button-wrapper">
        <div className="download-button">
          <CSVLink {...csvReport}>
            <Button variant="secondary">Download Jobs</Button>
          </CSVLink>
        </div>
        <div className="upload-button">
          <Upload {...props}>
            <Button variant="secondary">
              <UploadOutlined /> Attach File
            </Button>
          </Upload>
        </div>
      </div>
      <div className="Modal-footer-button">
        <Button variant="primary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleImport} disabled={importButtonControl}>
          Import
        </Button>
      </div>
    </Modal>
  );
};

export default ModelView;
