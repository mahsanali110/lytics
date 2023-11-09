import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button } from 'components/Common';
import Editor1 from './Editor1';
import Editor2 from './Editor2';
import { Upload, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './editor.scss';
import { size } from 'lodash';
import {ImageFileSize} from '../../../../constants/filesImport';
function EditorBlock({ data, setData, source }) {
  const user = useSelector(state => state.authReducer.user);
  const [textFile, setTextFile] = useState('');
  const [tempData, setTempData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [title, setTitle] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState("");

  const imgFile = fileList?.filter(
    f => f.type == 'image/jpeg' || f.type == 'image/png' || f.type == 'image/jpg'
  );
  const tFile = fileList?.filter(f => f.type == 'text/plain');
  var finalText;
  var finalThumbnail;
  const getBase64 = () => {
    return new Promise((resolve, reject) => {
      if (imgFile[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(imgFile[0]);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      }
    });
  };
  // const getText = () => {
  //   return new Promise((resolve, reject) => {
  //     if (tFile[0]) {
  //       const reader = new FileReader();
  //       reader.readAsText(tFile[0]);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = error => reject(error);
  //     }
  //   });
  // };
  const handlePreview = async () => {
    // finalText = await getText();
    // setTextFile(finalText);

    finalThumbnail = await getBase64();
    setThumbnailFile(finalThumbnail);
  };
  useEffect(() => {
    handlePreview();
  }, [fileList]);

  const handleImport = () => {
    var temp = [];
    var jobObj = {};
    jobObj.channel = '';
    jobObj.comments = '';
    jobObj.guests = '';
    jobObj.language = '';
    jobObj.priority = 'HIGH'.toUpperCase();
    jobObj.programDate = '';
    jobObj.programDescription = `${title}`;
    jobObj.programName = '';
    jobObj.programTime = '';
    jobObj.programType = '';
    jobObj.region = '';
    jobObj.thumbnailPath = `${imgFile[0]?.name}`;
    jobObj.videoPath = '';
    jobObj.source = `${source}`;
    jobObj.anchor = '';
    jobObj.publisher = '';
    jobObj.topic1 = '';
    jobObj.topic2 = '';
    jobObj.topic3 = '';
    jobObj.hashtags = '';
    jobObj.clippedBy = user.firstName + " "+ user.lastName;
    jobObj.jobState = 'Pending';
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

    let temptopic1 = jobObj?.topic1.split('|');
    let temptopic2 = jobObj?.topic2.split('|');
    let temptopic3 = jobObj?.topic3.split('|');
    let temphashtag = jobObj?.hashtags.split('|');
    let tempS = [];
    let topic1 = {};
    let topic2 = [];
    let topic3 = [];
    let thashtags = [];
    let hashtags = [];
    if (temptopic1?.length > 0 || temphashtag?.length > 0) {
      temptopic1.forEach(t => {
        if (t === '') return;
        topic1 = t;
      });
      if (temptopic2?.length > 0) {
        temptopic2.forEach(t => {
          if (t === '') return;
          topic2.push(t);
        });
      }
      if (temptopic3?.length > 0) {
        temptopic3.forEach(t => {
          if (t === '') return;
          topic3.push(t);
        });
      }
      temphashtag.forEach(t => {
        if (t === '') return;
        thashtags.push(t);
      });
      hashtags.push({ originalTag: thashtags, transformTag: thashtags });
      tempS.push({ topics: { topic1, topic2, topic3 }, hashtags });
      jobObj.segments = tempS;
    }
    jobObj.readyFor = ['Clipper','QC','Marker','Compiler','Reviewer'];
    jobObj.translation = [{ duration: '', speaker: '', line: `${textFile}` }];
    jobObj.transcription = [{ duration: '', speaker: '', line: '' }];

    jobObj.jobState = 'Ready for Marking';
    jobObj.engineStatus = 'COMPLETED';
    temp.push(jobObj);
    setTempData(temp);
  };
console.log(tempData);
  const props = {
    name: 'file',
    multiple: false,
    accept: '.png, .jpg, .jpeg',
    showUploadList: false,
    onRemove: file => {
      setFileList([]);
    },
    beforeUpload: file => {
      console.log(file.status);
      if(file.size>ImageFileSize)
      {
        message.error(`${file.name} size must be smaller than 256KB`);
      }
      else
      {
      setFileList(prev => [...prev, file]);
      }
      return false;
    },
    fileList,
  };
  useEffect(() => {
    setData({ data: tempData, fileList });
  }, [tempData]);
  useEffect(() => {
    handleImport();
    console.log(title,textFile);
  }, [title, textFile]);

  const content = (
    <>
      {/* {fileList.length <= 0 ? (
        <>
          <div className="button-wrapper">
            <div className="upload-button">
              <Upload {...props}>
                <Button
                  style={{ top: '30vh', left: '15vw', transform: 'translate(-50%,-50%' }}
                  onClick={() => handleImport}
                >
                  Attach File
                </Button>
              </Upload>
            </div>
            <div></div>
          </div>
        </>
      ) : ( */}
        <div style={{ backgroundColor: '#2A324A', height: '50vh' }}>
          <div>
            <Editor1 title={title} setTitle={setTitle} />
            {/* <Editor1/> */}
          </div>
          {thumbnailFile.length<=0?(
          <div className='Modal'>
          {/* <Upload {...props}>
                <Button
                  style={{ top: '30vh', left: '15vw', transform: 'translate(-50%,-50%' }}
                  onClick={() => handleImport}
                >
                  Attach File
                </Button>
              </Upload> */}
      <div className="modal-heading">
        <h3 className="modal-Heading" style={{ color: 'white', marginTop: '17px' }}>
          Import Image
        </h3>
      </div>
      <div className="button-wrapper">
        <div className="upload-button">
          <Upload {...props}>
            <Button className="btn" onClick={() => handleImport}>Attach File</Button>
          </Upload>
        </div>
        {thumbnailFile.length>0?(""):(
          <div className="file-label">
            <h1>No file selected</h1>
          </div>
          )}
      </div>
      </div>
              ):
(
      <div>
        {/* <span>
        <DeleteOutlined />
        </span> */}
            <img
              src={thumbnailFile}
              style={{
                height: '250px',
                // width: '200px',
                display: 'block',
                marginLeft: 'auto',
                marginTop:'3rem',
                marginRight: 'auto',
              }}
            ></img>
          </div>
)}
          <div style={{marginTop:"3rem"}}>
          {/* <div>{textFile ? <Editor2 textFile={textFile} setTextFile={setTextFile} /> : ''}</div> */}
              <Editor2  textFile={textFile} setTextFile={setTextFile}/>
              </div>
        </div>
       {/* )}  */}
    </>
  );
  return (
    <div className="card-wrapper">
      <Card
        className="card-container-primary medium square overflow"
        title="Article"
        shape="square"
        content={content}
        style={{ overFlow: 'hidden' }}
      />
    </div>
  );
}

export default EditorBlock;
