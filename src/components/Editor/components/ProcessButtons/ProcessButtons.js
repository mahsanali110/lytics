import React, { useState, useEffect } from 'react';
import { Row, Col, Button, message as antMessage } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { saveAs } from 'file-saver';
import moment from 'moment';

import './ProcessButtons.scss';

import editorActions from 'modules/editor/actions';

// import { downloadVideo } from 'modules/common/utils';

function ProcessButtons({
  onSave,
  onProcess,
  onDownload,
  programInfo,
  processFields,
  isClip,
  isScreen,
  isTicker,
  isVideoClipped,
  handleYoutubeShare,
}) {
  const dispatch = useDispatch();
  const { jobCreationLoading, jobShareLoading, youtubePostLoading } = useSelector(
    state => state.libraryJobsReducer
  );
  const editorReducer = useSelector(state => state.editorReducer);
  const { exportVideo, exportLoading, clipData } = editorReducer;
  const [source, setSource] = useState({});

  useEffect(() => {
    if (isClip) return setSource('clipData');
    if (isScreen) return setSource('screenData');
    if (isTicker) return setSource('tickerData');
  }, []);
  const downloadVideo = async (url, name) => {
    try {
      dispatch(editorActions.updateByField({ field: 'exportLoading', value: true }));
      let fileName = `${programInfo.channel}_${moment(programInfo.programDate).format(
        'DD/MM/YYYY_HH:mm:ss'
      )}.mp4`;

      const response = await axios({
        method: 'GET',
        url,
        responseType: 'blob',
        crossdomain: true,
      });
      var blob = new Blob([response.data], {
        type: 'video/mp4',
      });

      saveAs(blob, fileName);
      dispatch(editorActions.updateByField({ field: 'exportLoading', value: false }));

      antMessage.success('Video Downloaded Successfully', 5);
    } catch (error) {
      console.log({ error });
      dispatch(editorActions.updateByField({ field: 'exportLoading', value: false }));
      antMessage.error('Video Downloaded Failed', 5);
    }
  };

  const handleSubmit = () => {
    if (!programInfo.isPersonalLibrary && !programInfo.isCompanyLibrary)
      return antMessage.error('Please check one of the library', 3);
    onSave();
  };

  const handleProcess = () => {
    if (processFields.save) {
      if (!editorReducer[source].isPersonalLibrary && !editorReducer[source].isCompanyLibrary)
        return antMessage.error('Please check one of the library', 3);
      onSave();
    }
    if (processFields.download) {
      if (exportLoading) return antMessage.info('downloading is already in progress');
      if (isClip) downloadVideo(programInfo.videoPath);
      if (isScreen) dispatch(editorActions.updateByField({ field: 'downloadScreen', value: true }));
      if (isTicker) dispatch(editorActions.updateByField({ field: 'downloadTicker', value: true }));
    }
    if (processFields.lens) {
      dispatch(editorActions.updateByField({ field: 'shareToLens', value: true }));
    }
    if (processFields.youtube) {
      handleYoutubeShare(programInfo.videoPath);
    }
  };
  return (
    <div className="process-buttons-wrapper">
      <Row gutter={8} justify="center">
        {/* <Col>
          <Button loading={loading} onClick={handleSubmit}>
            Save
          </Button>
        </Col> */}
        <Col>
          <Button
            className="process-button mt-10"
            onClick={handleProcess}
            disabled={
              !Object.values(processFields).find(ele => ele === true) ||
              (isClip ? !isVideoClipped : false)
            }
            loading={exportLoading || jobCreationLoading || jobShareLoading || youtubePostLoading}
          >
            Process
          </Button>
        </Col>
        {/* <Col>
          <Button disabled onClick={downloadVideo}>
            Download
          </Button>
        </Col> */}
      </Row>
    </div>
  );
}

ProcessButtons.PropTypes = {
  onSave: PropTypes.func,
  onProcess: PropTypes.func,
  onDownload: PropTypes.func,
};

ProcessButtons.defaultProps = {
  onSave: () => {},
  onProcess: () => {},
  onDownload: () => {},
};

export default ProcessButtons;
