import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Row, Col } from 'antd';
import { pick } from 'lodash';

import { Tabs, Button, PageNavigation, VideoPlayer, Statement } from 'components/Common';
import { MediaAnalysis, GuestAnalysis } from './components';
import { markerEditActions } from 'modules/markerEdit/actions';

import navActions from 'modules/navigation/actions';
import commonActions from 'modules/common/actions';

import { LeftOutlined } from '@ant-design/icons';

import './MarkerView.scss';
import { SAVE } from 'constants/hotkeys';
import { makeTextFrom } from 'modules/common/utils';

const MarkerEdit = ({ history, match: { params } }) => {
  const dispatch = useDispatch();
  const nextPageProps = useSelector(state => state.pageNavReducer);

  const { index, next, prev } = nextPageProps.job?.nav ?? {};

  const job = useSelector(state => state.markerEditReducer);
  const videoCurrentTime = useSelector(state => state.commonReducer.videoCurrentTime);

  const data = pick(job, [
    'guests',
    'themes',
    'segments',
    'translation',
    'programDescription',
    'comments',
    'clippedBy',
  ]);

  const programInfo = pick(job, [
    'channel',
    'clippedBy',
    'programName',
    'programDate',
    'programTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
  ]);

  useEffect(() => {
    fetchDefaultConfigurations();
  }, []);

  useEffect(() => {
    dispatch(markerEditActions.getDataById.request(params.jobId));
  }, [params.jobId]);

  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchHosts.request());
    dispatch(commonActions.fetchThemes.request());
    dispatch(commonActions.fetchTopics.request());
    dispatch(commonActions.fetchGuests.request());
  };

  const handleSubmit = () => {
    dispatch(
      markerEditActions.updateMarker.request({
        id: params.jobId,
        data,
      })
    );
  };

  useHotkeys(
    SAVE,
    e => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <div className="marker-edit-wrapper">
      <Row gutter={16}>
        <Col span="8">
          <div className="segment-statement-overall-wrapper">
            <div>
              <Button type="big" icon={LeftOutlined} onClick={() => history.push('/search')}>
                BACK
              </Button>
            </div>
            <VideoPlayer
              src={programInfo.videoPath}
              programInfo={programInfo}
              style={{ maxHeight: '270px' }}
            />
            {job?.language == 'ENGLISH' ? (
              <Statement
                Ttype="Transcription"
                title="Transcription"
                height="270px"
                content={makeTextFrom(job.transcription, videoCurrentTime, 'Transcription')}
                handleOnchange={value =>
                  dispatch(markerEditActions.updateByField({ field: 'transcription', value }))
                }
                language={job?.language?.toLowerCase()}
                programInfo={programInfo}
              />
            ) : (
              <Statement
                Ttype="Translation"
                title="Translation"
                height="270px"
                content={makeTextFrom(job.translation, videoCurrentTime, 'Translation')}
                handleOnchange={value =>
                  dispatch(markerEditActions.updateByField({ field: 'translation', value }))
                }
                programInfo={programInfo}
              />
            )}
          </div>
        </Col>
        <Col span="16">
          <Tabs
            type="card"
            tabPanes={[
              { title: 'Media Analysis', content: <MediaAnalysis /> },
              { title: 'Guest Analysis', content: <GuestAnalysis /> },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MarkerEdit;
