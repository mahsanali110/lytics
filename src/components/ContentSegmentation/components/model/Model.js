import React, { useState, useEffect, useRef } from 'react';
import { Modal, Upload, message } from 'antd';
import { UploadOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { Button } from 'components/Common';
import { useDispatch, useSelector } from 'react-redux';
import './model.scss';
import commonActions from 'modules/common/actions';
import channelActions from 'modules/channels/actions';
import moment from 'moment';
import { VideoFileSize, CSVRows, ImageFileSize } from '../../../../constants/filesImport';
import { result } from 'lodash';
var Papa = require('papaparse/papaparse.min.js');
const ModelView = ({
  openModal,
  setopenModal,
  jobs,
  setData,
  setunvalidData,
  data,
  isPrint,
  isOnline,
  isTwitter,
}) => {
  const dispatch = useDispatch();

  const videoFileList = useRef([]);
  const thumbnailFileList = useRef([]);
  const txtFileList = useRef([]);
  const FileListName = useRef([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [importButtonControl, setimportButtonControl] = useState(true);
  const [hostname, sethostname] = useState([]);
  const [programTypeName, setprogramTypeName] = useState([]);
  const [programNAME, setprogramNAME] = useState([]);
  const [Channelname, setChannelname] = useState([]);
  const [Guestname, setGuestname] = useState([]);
  const [topicsName, setTopicsname] = useState([]);
  const [topics2Name, setTopics2name] = useState([]);
  const [topics3Name, setTopics3name] = useState([]);
  const [hashtagsName, setHashtagsname] = useState([]);
  const [Regionname, setRegionname] = useState(['Local', 'National', 'International']);
  const [piriortyName, setpiriortyName] = useState(['URGENT', 'HIGH', 'MEDIUM', 'LOW']);
  const [sourceName, setsourceName] = useState(['Online', 'Print', 'Blog', 'Social']);
  const { hosts, programTypes, programNames, guests, topics, hashTagOptions } = useSelector(
    state => state.commonReducer
  );
  const { channels } = useSelector(state => state.channelsReducer);
  const user = useSelector(state => state.authReducer.user);
  useEffect(() => {
    dispatch(commonActions.fetchTopics.request());
    dispatch(commonActions.fetchHashtags.request());
  }, []);

  useEffect(() => {
    sethostname(Array.from(hosts, ({ name }) => name));
    setprogramTypeName(Array.from(programTypes, ({ name }) => name));
    setprogramNAME(Array.from(programNames, ({ title }) => title));
    setChannelname(Array.from(channels, ({ name }) => name));
    setGuestname(Array.from(guests, ({ name }) => name));
    setTopicsname(Array.from(topics, ({ name }) => name));

    let fileNameResult = fileList.map(p => {
      return p.name;
    });
    FileListName.current = fileNameResult;

    let videoFileListFilter = fileList.filter(f => f.type === 'video/mp4');
    videoFileList.current = videoFileListFilter;

    let thumbnailFileListFilter = fileList.filter(
      f => f.type === 'image/png' || f.type === 'image/jpeg' || f.type === 'image/jpg'
    );
    thumbnailFileList.current = thumbnailFileListFilter;
    let txtFileListFilter = fileList.filter(f => f.type === 'text/plain');
    txtFileList.current = txtFileListFilter;

    var temp2 = [];
    for (var t2 = 0; t2 < topics.length; t2++) {
      for (var tt2 = 0; tt2 < topics[t2].topic2.length; tt2++) {
        temp2.push(topics[t2].topic2[tt2]);
      }
    }
    setTopics2name(Array.from(temp2, ({ name }) => name));

    var temp3 = [];
    for (var t3 = 0; t3 < topics.length; t3++) {
      for (var tt3 = 0; tt3 < topics[t3].topic2.length; tt3++) {
        for (var ttt3 = 0; ttt3 < topics[t3].topic2[tt3].topic3.length; ttt3++) {
          temp3.push(topics[t3].topic2[tt3].topic3[ttt3]);
        }
      }
    }
    setTopics3name(Array.from(temp3, ({ name }) => name));
    if (hashTagOptions) {
      const hashtagsName = hashTagOptions.map(hashTag => hashTag.hashTag);
      setHashtagsname(hashtagsName);
    }
  }, [
    hosts,
    programTypes,
    programNames,
    channels,
    guests,
    topics,
    hashTagOptions,
    csvData,
    fileList,
  ]);
  let err = [];
  const props = {
    name: 'file',
    multiple: true,
    accept: '.csv, .png, .jpg, .jpeg, .mp4, .txt',
    showUploadList: false,
    onRemove: file => {
      setFileList([]);
      setimportButtonControl(true);
    },
    beforeUpload: file => {
      if (file.type == 'video/mp4') {
        if (file.size > VideoFileSize) {
          message.error(`${file.name} size must be smaller than 256 MB`);
          err.push(file);
        } else {
          setFileList(prev => [...prev, file]);
        }
      } else if (
        file.type == 'image/jpg' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/png'
      ) {
        if (file.size > ImageFileSize) {
          message.error(`${file.name} size must be smaller than 256 KB`);
          err.push(1);
        } else {
          setFileList(prev => [...prev, file]);
        }
      } else {
        setFileList(prev => [...prev, file]);
      }
      if (err.length > 0) {
        setimportButtonControl(true);
        setFileList([]);
      } else {
        setimportButtonControl(false);
      }
      return false;
    },
    fileList,
    onChange(info) {},
  };

  useEffect(() => {
    setIsModalVisible(openModal);
  }, [openModal]);
  const fetchChannels = () => dispatch(channelActions.getChannels.request());

  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchHosts.request());
    dispatch(commonActions.fetchProgramTypes.request());
    dispatch(commonActions.fetchProgramNames.request());
    dispatch(commonActions.fetchGuests.request());
  };
  useEffect(() => {
    fetchChannels();
    fetchDefaultConfigurations();
  }, []);
  const handleOk = () => {
    setIsModalVisible(false);
    setopenModal(false);
  };

  const handleCancel = () => {
    setData([]);
    setopenModal(false);
  };
  const handleImport = () => {
    const file = fileList.filter(f => f.type == 'application/vnd.ms-excel' || f.type == 'text/csv');
    var temp = [];
    var jobObj = {};
    var txtCsvFile;
    if (file.length <= 0) {
      message.error('You have not uploaded CSV Kindly Upload it');
    } else if (file.length > 1) {
      message.error('You have uploaded more than one CSV');
    } else {
      Papa.parse(file[0], {
        download: true,
        headers: false,
        complete: async results => {
          {
            if (results.data.length - 2 > CSVRows) {
              message.error('CSV data must be 25 Rows');
            } else if (videoFileList.current.length > 25 && !isPrint && !isTwitter) {
              message.error('Maximum Limit of Video Files must be 25');
            } else if (
              videoFileList.current.length > results.data.length - 2 &&
              !isPrint &&
              !isTwitter
            ) {
              message.error('you have uploaded more videos than csv rows');
            } else if (
              videoFileList.current.length < results.data.length - 2 &&
              !isPrint &&
              !isTwitter
            ) {
              message.error('you have uploaded less videos than csv rows');
            } else if (txtFileList.current.length > 25 && isPrint) {
              message.error('Maximum Limit of Text Files must be 25');
            } else if (txtFileList.current.length > results.data.length - 2 && isPrint) {
              message.error('you have uploaded more Text Files than csv rows');
            } else if (txtFileList.current.length < results.data.length - 2 && isPrint) {
              message.error('you have uploaded less Text Files than csv rows');
            } else if (thumbnailFileList.current.length > 25) {
              message.error('Maximum Limit of thumbnail Files must be 25');
            } else if (thumbnailFileList.current.length > results.data.length - 2) {
              message.error('you have uploaded more thumbnails than csv rows');
            } else if (thumbnailFileList.current.length < results.data.length - 2) {
              message.error('you have uploaded less thumbnails than csv rows');
            } else if (results.data[0][3] !== 'Language') {
              message.error('Language is not included in CSV');
            } else {
              for (let i = 1; i < results.data.length - 1; i++) {
                jobObj = {};
                if (isTwitter) {
                  jobObj.source = results.data[i][0];
                  jobObj.channel = results.data[i][1];
                  jobObj.platform = results.data[i][2];
                  jobObj.language = results.data[i][3].toUpperCase();
                  jobObj.region = results.data[i][4];
                  jobObj.priority = results.data[i][5].toUpperCase();
                  jobObj.programName = results.data[i][6];
                  txtCsvFile = results.data[i][7];
                  jobObj.programUser = results.data[i][8];
                  jobObj.programType = results.data[i][9];
                  jobObj.programDate = moment(results.data[i][10], 'DD/MM/YYYY').format(
                    'YYYY/MM/DD'
                  );
                  jobObj.programTime = results.data[i][11];
                  jobObj.programLikes = results.data[i][12];
                  jobObj.thumbnailPath = results.data[i][13];
                  jobObj.videoPath = results.data[i][14];
                  jobObj.topic1 = results.data[i][15];
                  jobObj.topic2 = results.data[i][16];
                  jobObj.topic3 = results.data[i][17];
                  jobObj.hashtags = results.data[i][18];
                } else if (isOnline) {
                  jobObj.source = results.data[i][0];
                  jobObj.channel = results.data[i][1];
                  jobObj.platform = results.data[i][2];
                  jobObj.language = results.data[i][3].toUpperCase();
                  jobObj.region = results.data[i][4];
                  jobObj.priority = results.data[i][5].toUpperCase();
                  jobObj.comments = results.data[i][6];
                  jobObj.anchor = results.data[i][7];
                  jobObj.guests = results.data[i][8];
                  jobObj.programName = results.data[i][9];
                  jobObj.programType = results.data[i][10];
                  jobObj.programDate = moment(results.data[i][11], 'DD/MM/YYYY').format(
                    'YYYY/MM/DD'
                  );
                  jobObj.programTime = results.data[i][12];
                  jobObj.thumbnailPath = results.data[i][13];
                  jobObj.videoPath = results.data[i][14];
                  txtCsvFile = results.data[i][14];
                  jobObj.topic1 = results.data[i][15];
                  jobObj.topic2 = results.data[i][16];
                  jobObj.topic3 = results.data[i][17];
                  jobObj.hashtags = results.data[i][18];
                } else {
                  jobObj.source = results.data[i][0];
                  jobObj.channel = results.data[i][1];
                  jobObj.platform = results.data[i][2];
                  jobObj.language = results.data[i][3].toUpperCase();
                  jobObj.region = results.data[i][4];
                  jobObj.priority = results.data[i][5].toUpperCase();
                  jobObj.comments = results.data[i][6];
                  jobObj.publisher = results.data[i][7];
                  jobObj.guests = results.data[i][8];
                  jobObj.programName = results.data[i][9];
                  jobObj.programType = results.data[i][10];
                  jobObj.programDate = moment(results.data[i][11], 'DD/MM/YYYY').format(
                    'YYYY/MM/DD'
                  );
                  jobObj.programTime = results.data[i][12];
                  jobObj.thumbnailPath = results.data[i][13];
                  jobObj.videoPath = results.data[i][14];
                  txtCsvFile = results.data[i][14];
                  jobObj.topic1 = results.data[i][15];
                  jobObj.topic2 = results.data[i][16];
                  jobObj.topic3 = results.data[i][17];
                  jobObj.hashtags = results.data[i][18];
                  // Clipper - Systems 358- 3rd bug
                  if (window.location.hash === '#/web' && txtCsvFile !== 'web.txt') {
                    return message.error('Not a Web CSV');
                  } else if (window.location.hash === '#/print' && txtCsvFile !== 'print.txt') {
                    return message.error('Not a Print CSV!');
                  }
                }
                let anchor = jobObj?.anchor?.split('|');
                if (anchor?.length > 0) {
                  jobObj.anchor = [...anchor];
                }
                let guest = jobObj?.guests?.split('|');
                let tempG = [];
                if (guest?.length > 0) {
                  guest.forEach(g => {
                    if (g === '') return;
                    tempG.push({ name: g, association: '', description: '' });
                  });
                  jobObj.guests = tempG;
                }
                let temptopic1;
                let temptopic2;
                let temptopic3;
                let temphashtag;
                if (jobObj?.topic1.length > 0) {
                  temptopic1 = jobObj?.topic1?.split('|');
                }
                if (jobObj?.topic2.length > 0) {
                  temptopic2 = jobObj?.topic2?.split('|');
                }
                if (jobObj?.topic3.length > 0) {
                  temptopic3 = jobObj?.topic3?.split('|');
                }
                temphashtag = jobObj?.hashtags?.split('|');
                let tempS = [];
                let topic1 = '';
                let topic2 = [];
                let topic3 = [];
                let hashtags = [];
                if (temptopic1?.length > 0 || temphashtag?.length > 0) {
                  temptopic1?.forEach(t => {
                    if (t === '') return;
                    topic1 = t;
                  });
                  if (temptopic2?.length > 0) {
                    temptopic2?.forEach(t => {
                      if (t === '') return;
                      topic2.push(t);
                    });
                  }
                  if (temptopic3?.length > 0) {
                    temptopic3?.forEach(t => {
                      if (t === '') return;
                      topic3.push(t);
                    });
                  }
                  temphashtag?.forEach(t => {
                    if (t === '') return;
                    hashtags.push(t);
                  });
                  tempS.push({ topics: { topic1, topic2, topic3 }, hashtags });
                  jobObj.segments = tempS;
                }
                let channelLogoPath = '';
                channels.forEach(({ name, logoPath }) => {
                  if (jobObj.channel === name) {
                    channelLogoPath = logoPath;
                  }
                });
                jobObj.channelLogoPath = channelLogoPath.split('/').slice(-1)[0];
                if (isPrint) {
                  const txtFile = fileList?.filter(f => f.name === txtCsvFile);
                  if (txtFile.length < 1) {
                    return message.error('Wrong formate of CSV file');
                  }
                  const txtF = txtFile[0];
                  const getText = () => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.readAsText(txtF);
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = error => reject(error);
                    });
                  };
                  var finalText;
                  const handlePreview = async () => {
                    return (finalText = await getText());
                  };
                  const result = await handlePreview();
                  jobObj.transcription = [{ duration: '', speaker: '', line: `${result}` }];
                }
                if (isTwitter) {
                  jobObj.transcription = [{ duration: '', speaker: '', line: `${txtCsvFile}` }];
                }
                temp.push(jobObj);
              }
              setCsvData(temp);
            }
          }
        },
      });
    }
  };
  useEffect(() => {
    let temp = [];
    let val;
    var date_reg = /^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
    var regexTime = /^([0]\d|[1][0-2]):([0-5]\d)\s?(?:AM|PM)$/i;

    csvData.forEach((data, index) => {
      val = [];
      if (data?.platform?.length <= 0) {
        val.push('Platform is empty.');
      }
      if (regexTime.test(data?.programTime ) === false || data?.programTime?.length <= 0) {
        val.push('Time is invalid.');
      }
      if (date_reg.test(data?.programDate) === false || data?.programDate?.length <= 0) {
        val.push('Date is invalid.');
      }
      if (data?.programName?.length <= 0) {
        val.push('Title is empty.');
      }
      data?.anchor?.forEach(anchor => {
        if (!hostname.includes(anchor)) {
          val.push(`${anchor} as anchor doesn't exist.`);
        }
      });
      data?.guests?.forEach(guest => {
        if (!Guestname.includes(guest.name)) {
          val.push(`${guest.name} as guest doesn't exist.`);
        }
      });
      if (!programTypeName.includes(data?.programType)) {
        val.push(`${data.programType} as program Type doesn't exist.`);
      }
      if (!Channelname.includes(data?.channel)) {
        val.push(`${data.channel} as channel name doesn't exist.`);
      }
      if (!Regionname.includes(data?.region)) {
        val.push(`${data.region} as region doesn't exist.`);
      }
      if (!piriortyName.includes(data?.priority)) {
        val.push(`${data.priority} as priority doesn't exist.`);
      }
      if (!FileListName.current.includes(data?.thumbnailPath)) {
        val.push(
          `${data.thumbnailPath} has not been uploaded,Kindly check if you have entered correct file name in CSV`
        );
      }
      if (!isTwitter) {
        if (!FileListName.current.includes(data?.videoPath)) {
          val.push(
            `${data.videoPath} has not been uploaded,Kindly check if you have entered correct file name in CSV`
          );
        }
      }

      if (data?.segments[0]?.topics?.topic1 === '') {
      } else {
        if (!topicsName?.includes(data?.segments[0]?.topics?.topic1)) {
          val.push(`${data?.segments[0].topics.topic1} as topic 1 doesn't exist.`);
        }
      }
      if (data?.segments[0]?.topics?.topic2.length > 0) {
        for (var t2 = 0; t2 < data?.segments[0]?.topics?.topic2.length; t2++) {
          if (topicsName?.includes(data?.segments[0]?.topics?.topic1)) {
            if (!topics2Name?.includes(data?.segments[0]?.topics?.topic2[t2])) {
              val.push(`${data?.segments[0].topics.topic2[t2]} as topic 2 doesn't exist.`);
            }
          }
        }
      }
      if (data?.segments[0]?.topics?.topic2.length > 0) {
        if (topicsName?.includes(data?.segments[0]?.topics?.topic1)) {
          for (var t3 = 0; t3 < data?.segments[0]?.topics?.topic3.length; t3++) {
            if (!topics3Name?.includes(data?.segments[0]?.topics?.topic3[t3])) {
              val.push(`${data?.segments[0].topics.topic3} as topic 3 doesn't exist.`);
            }
          }
        }
      }

      var tempHash = data?.segments[0]?.hashtags[0]?.originalTag;
      for (var i = 0; i < tempHash?.length; i++) {
        if (!hashtagsName.includes(tempHash[i])) {
          dispatch(commonActions.createHashtag.request({ hashTag: tempHash[i] }));
        }
      }
      var hashd = data?.segments[0]?.hashtags[0]?.originalTag;
      for (var i = 0; i < hashd?.length; i++) {
        if (!hashd[i].startsWith('#')) {
          val.push(`${hashd[i]} as hashtags must starts with #`);
        }
      }

      if (!sourceName.includes(data?.source)) {
        val.push(`${data.source} as source doesn't exist.`);
      }

      if (val?.length <= 0) {
      } else {
        temp.push({ key: index, line: val });
      }
    });
    if (temp?.length > 0) {
      setunvalidData(temp);
    } else {
      if (isPrint) {
        const files = fileList.filter(
          f =>
            f.type !== 'application/vnd.ms-excel' &&
            f.type !== 'text/csv' &&
            f.type !== 'text/plain'
        );
        setData({ data: csvData, files });
        getThumbnailDataURL();
      } else {
        const files = fileList.filter(
          f => f.type !== 'application/vnd.ms-excel' && f.type !== 'text/csv'
        );
        setData({ data: csvData, files });
        getThumbnailDataURL();
      }
    }
  }, [
    csvData,
    hostname,
    programTypeName,
    programNAME,
    Channelname,
    Guestname,
    Regionname,
    piriortyName,
    sourceName,
    topicsName,
  ]);
  const getThumbnailDataURL = () => {
    const jobs = csvData;
    const files = fileList.filter(f => f.type !== 'application/vnd.ms-excel');
    jobs.forEach((f, index) => {
      for (const file of files) {
        if (f.thumbnailPath === file.name) {
          f.thumbnailPathURL = URL.createObjectURL(file);
        }
      }
    });
    setData({ data: csvData, files });
  };
  return (
    <div className="Model">
      <div className="modal-heading">
        <CloseCircleTwoTone
          className="modal-close-icon"
          onClick={() => {
            handleCancel();
          }}
        />
        <h3 className="modal-Heading" style={{ color: 'white', marginTop: '17px' }}>
          Import File
        </h3>
      </div>
      <div className="button-wrapper">
        <div className="upload-button">
          <Upload {...props}>
            <Button
              className="btn"
              onClick={() => {
                setFileList([]);
              }}
            >
              Attach File
            </Button>
          </Upload>
        </div>
        {fileList.length == 0 ? (
          <div className="file-label">
            <h1>No file selected</h1>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="Modal-footer-button">
        <Button
          variant="secondary"
          onClick={() => {
            handleImport();
          }}
          disabled={importButtonControl}
        >
          Import
        </Button>
      </div>
    </div>
  );
};

export default ModelView;
