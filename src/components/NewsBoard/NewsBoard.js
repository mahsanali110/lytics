import { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { Col, Row } from 'antd';
import axios from 'axios';
import { pick } from 'lodash';

import './NewsBoard.scss';

import { ContentWrapper, JobCard } from './components';

import channelsActions from 'modules/channels/actions';
import { channelActions as CA } from '../../modules/multiview/actions';
import { jobActions } from 'modules/jobs/actions';
import { filterJobSources } from 'constants/index';
import newsboardActions from 'modules/newsboard/actions';

import { useDispatch, useSelector } from 'react-redux';
import { ACTUS_CHANNELS_API_PATH, ACTUS_PATH, newsBoardStreamEndPoint } from 'constants/index';
import useSSE from 'hooks/useSSE';
import NewsBoardPlayers from './components/Players/players';

const NewsBoard = () => {
  const dispatch = useDispatch();

  // * Constants
  const TV = 'Tv';

  // * Selectors
  const { channels } = useSelector(state => state.channelsReducer);
  const { job, loading } = useSelector(state => state.jobsReducer);
  const { tvOnline, printWeb, social, ticker } = useSelector(state => state.newsboardReducer);
  const programInfo = pick(job, [
    'channel',
    'clippedBy',
    'programName',
    'programDate',
    'programTime',
    'segmentTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
  ]);
  // * Hooks
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [tableFilters, setTableFilters] = useState({
    // start_date: moment().subtract(1, 'days').format(format), // ! set the date to previous 3 days, kindly don't change it
    // end_date: moment().format(format),
    limit: 30,
    guest: '',
    page: pageNumber ?? 1,
    escalation: '',
    association: '',
    appliedPreset: '',
    searchText: searchText,
    jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
  });

  useEffect(() => {
    fetchDefault();
    const closeEventStream = useSSE(
      newsBoardStreamEndPoint,
      streamSuccessCallback,
      streamErrorCallback
    );
    checkActus();
    dispatch(jobActions.reset.request());
    dispatch(CA.getActusURL.request());

    return () => {
      dispatch(jobActions.resetJob());
      closeEventStream();
      dispatch(newsboardActions.resetNewsboardReducer());
    };
  }, []);

  // * Functions
  function streamSuccessCallback(event) {
    const data = JSON.parse(event.data);
    if (data?.eventType === 'new-job') {
      dispatch(newsboardActions.updateJobArray(data.data));
    }
  }

  function streamErrorCallback(error) {
    console.log({ error });
  }
  const fetchDefault = () => {
    dispatch(
      newsboardActions.fetchTvOnlineJobs.request({
        ...tableFilters,
        source: filterJobSources.filter(src => src === 'Tv' || src === 'Online'),
        channel: [
          ...channels
            .filter(_ => {
              if (_.type === 'Tv' || _.type === 'Online') return _;
            })
            .map(_ => _.name),
        ],
      })
    );
    dispatch(
      newsboardActions.fetchPrintWeb.request({
        ...tableFilters,
        source: filterJobSources.filter(src => src === 'Blog' || src === 'Print'),
        channel: [
          ...channels
            .filter(_ => {
              if (_.type === 'Blog' || _.type === 'Print') return _;
            })
            .map(_ => _.name),
        ],
      })
    );
    dispatch(
      newsboardActions.fetchSocialJobs.request({
        ...tableFilters,
        source: filterJobSources.filter(src => src === 'Social'),
        channel: [
          ...channels
            .filter(_ => {
              if (_.type === 'Social') return _;
            })
            .map(_ => _.name),
        ],
      })
    );
    dispatch(
      newsboardActions.fetchTickerJobs.request({
        ...tableFilters,
        source: filterJobSources.filter(src => src === 'Ticker'),
        channel: [
          ...channels
            .filter(_ => {
              if (_.type === 'Ticker') return _;
            })
            .map(_ => _.name),
        ],
      })
    );
    dispatch(channelsActions.getChannels.request());
  };

  const getJobById = useCallback(
    id => {
      dispatch(jobActions.getJobById.request(id));
    },
    [dispatch]
  );

  const checkActus = () => {
    axios
      .get('http://172.168.1.131/actus5/api/channels', {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        dispatch(CA.updateActus({ field: 'private', value: 'http://172.168.1.131/actus5' }));
        return;
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get(ACTUS_CHANNELS_API_PATH, {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        dispatch(CA.updateActus({ field: 'public', value: ACTUS_PATH }));

        return;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const tvChannels = useMemo(() => {
    const filterChannels = ({ type: source, name }) => source === TV;

    return channels?.filter(filterChannels) || [];
  }, [channels]);

  const handlePreviewPlaying = value => {
    setIsPreviewPlaying(value);
  };

  return (
    <div className="newsboard-wrapper">
      {/* <div className="disclaimer">BETA TESTING VERSION</div> */}
      <div className="channels-wrapper">
        <NewsBoardPlayers
          channels={tvChannels}
          isLoading={loading || tvOnline.loading}
          programInfo={programInfo}
          isPreviewPlaying={isPreviewPlaying}
          handlePreviewPlaying={handlePreviewPlaying}
        />
      </div>

      {/* Cards Wrapper */}
      <Row gutter={8} className="cards-wrapper" style={{ height: '100%' }}>
        <Col span={6} className="padding-left">
          <ContentWrapper heading={'TV & Online'}>
            <JobCard
              loading={tvOnline.loading}
              getJobById={getJobById}
              results={tvOnline.results}
              handlePreviewPlaying={handlePreviewPlaying}
              tvOnline
            />
          </ContentWrapper>
        </Col>
        <Col span={6}>
          <ContentWrapper heading={'Web & Print'}>
            <JobCard loading={printWeb.loading} results={printWeb.results} />
          </ContentWrapper>
        </Col>
        <Col span={6}>
          <ContentWrapper heading={'Twitter'}>
            <JobCard loading={social.loading} results={social.results} />
          </ContentWrapper>
        </Col>
        <Col span={6}>
          <ContentWrapper heading={'Tickers'}>
            <JobCard loading={ticker.loading} results={ticker.results} />
          </ContentWrapper>
        </Col>
      </Row>
      <div className="cards-wrapper"></div>
    </div>
  );
};

export default memo(NewsBoard);
