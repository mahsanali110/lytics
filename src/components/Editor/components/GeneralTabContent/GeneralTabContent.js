import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Image, Skeleton, Form, message as antMessage } from 'antd';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import './GeneralTabContent.scss';

import { Select, ProgressBar, Button, LoadingPage } from 'components/Common';

import { ProcessButtons, SavePopup, SocialButtons, LensShare, YoutubeShare } from '..';
import editorActions from 'modules/editor/actions';
import { isKeyPresent } from 'modules/common/utils';

function GeneralTabContent({
  programInfo,
  handleSubmit,
  handleYoutubeShare,
  children,
  isClip,
  isScreen,
  isTicker,
  processFields,
  handleClear,
}) {
  const dispatch = useDispatch();
  const { selectedWindows } = useSelector(state => state.liveClippingReducer);
  const { programNames } = useSelector(state => state.programNamesReducer);
  const { programTypes } = useSelector(state => state.programTypesReducer);
  const { singleJobLoading } = useSelector(state => state.libraryJobsReducer);

  const { exportVideo, actusVideoId, videoCurrentStatus } = useSelector(
    state => state.editorReducer
  );
  const [isVideoClipped, setIsVideoClipped] = useState(false);
  const [videoClipPercent, setVideoClipPercent] = useState(0);
  const videoStatusInterval = useRef(null);
  const [nestedField, setNestedField] = useState('');
  const [jobStartTime, setJobStartTime] = useState('');

  useEffect(() => {
    if (programInfo?.programTime) return setJobStartTime(programInfo?.programTime?.split('to')[0]);
    if (programInfo?.timeStamp)
      return setJobStartTime(moment(programInfo?.timeStamp).format('hh:mm A'));
  }, [programInfo]);

  useEffect(() => {
    if (isClip) setNestedField('clipData');
    if (isTicker) setNestedField('tickerData');
    if (isScreen) setNestedField('screenData');
  }, [isClip, isTicker, isScreen]);

  useEffect(() => {
    if (!actusVideoId) return;
    videoStatusInterval.current = setInterval(() => {
      dispatch(editorActions.checkVideoStatus.request({ videoId: actusVideoId }));
    }, 10000);

    return () => clearInterval(videoStatusInterval.current);
  }, [actusVideoId]);

  useEffect(() => {
    if (!videoCurrentStatus) return setVideoClipPercent(0);
    if (videoCurrentStatus === 'Complete') {
      clearInterval(videoStatusInterval.current);
      setVideoClipPercent(100);
      setIsVideoClipped(true);
      return;
    }
    setIsVideoClipped(false);
    if (videoCurrentStatus.includes('%')) {
      const percent = parseInt(exportVideo.videoCurrentStatus?.split(' ')[1]?.match(/\d+/)[0]) || 0;
      setVideoClipPercent(percent);
    }
  }, [videoCurrentStatus]);

  const handleUpdateField = ({ field, value, nestedField }) => {
    return dispatch(editorActions.updateByField({ field, value, nestedField }));
  };

  const onCancel = () => {
    handleUpdateField({ field: 'saveVisible', value: false });
  };

  return programInfo?.channel ? (
    singleJobLoading ? (
      <LoadingPage />
    ) : (
      <div className="clip-wrapper ">
        <Form layout="vertical">
          {(isScreen || isTicker) && (
            <Row className="mb-10" justify="end">
              <Col>
                <Button extraClass={'tiny-btn'} onClick={handleClear}>
                  Clear
                </Button>
              </Col>
            </Row>
          )}
          <Row className="mb-10">
            <Col className="text-white ff-roboto" style={{ marginRight: 'auto' }}>
              {programInfo.channel}
            </Col>
            <Col className="text-white ff-roboto" style={{ marginRight: '20px' }}>
              {moment(programInfo.programDate).format('DD MMMM YY')}
            </Col>
            <Col className="text-white d-flex" style={{ marginRight: '20px' }}>
              <div className="dot"></div>
            </Col>
            <Col className="text-white ff-roboto">{jobStartTime}</Col>
          </Row>

          <Row className="mb-10" gutter={16}>
            <Col span={12}>
              <Form.Item label="Program Name">
                <Select
                  value={programInfo.programName}
                  placeholder={'Program Name'}
                  style={{ width: '100%' }}
                  onChange={value =>
                    handleUpdateField({ field: 'programName', value, nestedField })
                  }
                  options={programNames
                    .filter(({ channel }) => channel === programInfo.channel)
                    .map(({ title }) => ({ title, value: title }))}
                  optionSort={false}
                  disabled={!selectedWindows.length}
                  showArrow={selectedWindows.length}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Program Type">
                <Select
                  value={programInfo.programType}
                  onChange={value =>
                    handleUpdateField({ field: 'programType', value, nestedField })
                  }
                  options={programTypes.map(({ name }) => ({ title: name, value: name }))}
                  placeholder={'Program Type'}
                  style={{ width: '100%' }}
                  optionSort={false}
                  disabled={!selectedWindows.length}
                  showArrow={selectedWindows.length}
                />
              </Form.Item>
            </Col>
          </Row>

          {children}

          <Row justify="center" className="mb-15 mt-15">
            {!isVideoClipped && selectedWindows.length > 0 && isClip && (
              <Col span={24} className="text-white mb-15">
                <h1 className="ff-roboto text-white" style={{ textAlign: 'center' }}>
                  Prepairing clip, please wait
                </h1>
                <ProgressBar percent={videoClipPercent} status={'active'} />
              </Col>
            )}
            {/* ) : ( */}
            <Col className="text-white">
              <SocialButtons
                handleUpdateField={handleUpdateField}
                disabled={false}
                programInfo={programInfo}
                processFields={processFields}
                isClip={isClip}
                isScreen={isScreen}
                isTicker={isTicker}
              />
            </Col>
            {/* )} */}
          </Row>

          <Row justify="center">
            <Col className="text-white">
              <ProcessButtons
                onSave={handleSubmit}
                programInfo={programInfo}
                processFields={processFields}
                isClip={isClip}
                isScreen={isScreen}
                isTicker={isTicker}
                isVideoClipped={selectedWindows.length ? isVideoClipped : true}
                handleYoutubeShare={handleYoutubeShare}
              />
            </Col>
          </Row>
          {processFields.lens && (
            <Row>
              <Col span={24}>
                <LensShare
                  jobId={programInfo?.id}
                  isLibraryJob={isKeyPresent(programInfo, 'isPersonalLibrary')}
                />
              </Col>
            </Row>
          )}

          {processFields.youtube && (
            <Row>
              <Col span={24}>
                <YoutubeShare
                  jobId={programInfo?.id}
                  handleUpdateField={handleUpdateField}
                  isLibraryJob={isKeyPresent(programInfo, 'isPersonalLibrary')}
                />
              </Col>
            </Row>
          )}

          {processFields.save && (
            <Row>
              <Col span={24}>
                <SavePopup
                  handleUpdateField={handleUpdateField}
                  programInfo={programInfo}
                  onCancel={onCancel}
                  handleSubmit={handleSubmit}
                  isClip={isClip}
                  isScreen={isScreen}
                  isTicker={isTicker}
                />
              </Col>
            </Row>
          )}
        </Form>
      </div>
    )
  ) : (
    <di>
      <h1 className="no-selection ff-roboto">No Selection!</h1>
    </di>
  );
}
function SkeletonWrapper() {
  return (
    <div className="clip-wrapper ">
      <Row className="mb-10">
        <Col className="text-white ff-roboto" span={6} style={{ marginRight: 'auto' }}>
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
        <Col className="text-white ff-roboto" span={4} style={{ marginRight: '20px' }}>
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
        <Col className="text-white ff-roboto" span={4}>
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
      </Row>

      <Row className="mb-10" gutter={16}>
        <Col span={12}>
          {' '}
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
        <Col span={12} style={{ paddingRight: '0px' }}>
          {' '}
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
      </Row>

      <Row className="mb-10" gutter={16}>
        <Col span={12}>
          {' '}
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
        <Col span={12} style={{ paddingRight: '0px' }}>
          {' '}
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
      </Row>

      <Row className="thumbnail-row" justify="center">
        <Col span={16}>
          <Image className="thumbnail-image" src={'image'} fallback="placeholder.png" />
        </Col>
      </Row>
      <Row justify="center">{/* <Col className="text-white">25.5</Col> */}</Row>

      <Row className="mb-10" gutter={16}>
        <Col span={24}>
          {' '}
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
      </Row>
      <Row className="mb-10" gutter={16}>
        <Col span={24}>
          {' '}
          <Skeleton.Input className="skeleton" size={'default'} />
        </Col>
      </Row>
      <Row className="mb-10" gutter={16}>
        <Col span={24}>
          {' '}
          <Skeleton.Input className="skeleton" active={false} size={'default'} />
        </Col>
      </Row>
    </div>
  );
}

export default GeneralTabContent;
