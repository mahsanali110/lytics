import { pick } from 'lodash';
import moment from 'moment';

import { VideoPlayer } from 'components/Common';
import { Image } from 'antd';
import { uploadPath } from 'constants/index';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { V3Tabs } from 'V3/components/Common';
import { Statement } from 'components/NewsBoard/components';
import { getUser, checkLanguageDirection, checkFontLanguage } from 'modules/common/utils';
import TwitterLogo from 'assets/images/Twitterlogo.png';

export const getMediaPreview = (jobObj, setPlayCheck) => {
  if (jobObj.source === 'Tv' || jobObj.source === 'Online') {
    const programInfo = pick(jobObj, [
      'channel',
      'clippedBy',
      'programName',
      'programDate',
      'programTime',
      'segmentStartTime',
      'segmentTime',
      'thumbnailPath',
      'channelLogoPath',
      'videoPath',
      'broadcastDate',
    ]);
    const tvPreview = (
      <VideoPlayer
        isLibrary={true}
        isClient={true}
        setPlayCheck={setPlayCheck}
        src={programInfo.videoPath}
        programInfo={programInfo}
      />
    );
    return tvPreview;
  }

  if (jobObj.source === 'Blog') {
    const webPreview = (
      <div className="web-preview-wrapper">
        <Image
          src={`${USERS_BASE_URL}/${uploadPath}/${jobObj.thumbnailPath}`}
          style={{
            width: '420px',
            height: '236px',
            objectFit: 'contain',
            margin: '0 auto',
            borderRadius: '6px',
          }}
          width={'100%'}
          preview={false}
          className="article-image"
          fallback={
            jobObj?.channelLogoPath
              ? `${USERS_BASE_URL}/${uploadPath}/${jobObj.channelLogoPath}`
              : 'placeholder.png'
          }
        ></Image>
      </div>
    );

    return webPreview;
  }
  if (jobObj.source === 'Social' || jobObj.source === 'Ticker') {
    const socialTickerMediaPreview = (
      <div className="social-ticker-media-preview">
        <div className="meta-info mb-15">
          <div className="meta-left">
            <Image
              src={`${USERS_BASE_URL}/${uploadPath}/${jobObj.channelLogoPath}`}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                margin: '0 auto',
                borderRadius: '100px',
              }}
              width={'48px'}
              height={'48px'}
              preview={false}
              className="article-image"
              fallback="placeholder.png"
            ></Image>
            <div className="source-info">
              <span className="fs-lg fw-500">{jobObj?.channel}</span>
              <span className="fs-md fw-500 fc-grey-light">{jobObj?.programUser}</span>
            </div>
          </div>
          <div className="meta-right">
            <span className="fs-sm fc-grey-light fw-500">
              {moment?.utc(jobObj?.broadcastDate)?.format('hh:mm A') || ''}
              <span className="fc-grey-light inline-block p-inline-1 "> • </span>
              {moment(jobObj?.broadcastDate).format('MMM DD YYYY')}
            </span>
          </div>
        </div>

        <div className="banner-image">
          <Image
            src={
              jobObj.source === 'Ticker'
                ? `${USERS_BASE_URL}/${uploadPath}/${jobObj.thumbnailPath}`
                : TwitterLogo
            }
            style={{
              width: '420px',
              height: '236px',
              objectFit: 'contain',
              margin: '0 auto',
              borderRadius: '6px',
              background: 'black',
            }}
            width={'100%'}
            preview={false}
            className="article-image"
            fallback="placeholder.png"
          ></Image>
        </div>
      </div>
    );

    return socialTickerMediaPreview;
  }

  if (jobObj?.source === 'Print') {
    const printMediaPreview = (
      <div className="print-media-preview-wrapper">
        <Image
          src={`${USERS_BASE_URL}/${uploadPath}/${jobObj.thumbnailPath}`}
          style={{
            width: '420px',
            height: '236px',
            objectFit: 'contain',
            margin: '0 auto',
            borderRadius: '6px',
          }}
          width={'100%'}
          preview={false}
          className="article-image"
          fallback={
            jobObj?.channelLogoPath
              ? `${USERS_BASE_URL}/${uploadPath}/${jobObj.channelLogoPath}`
              : 'placeholder.png'
          }
        ></Image>
      </div>
    );
    return printMediaPreview;
  }

  return <div> preview content</div>;
};

export const getDetailsPreview = (
  job,
  PlayCheck,
  setDisable,
  searchText,
  handleOnchange,
  statementFontSize
) => {
  if (job.source === 'Tv' || job.source === 'Online') {
    const programInfo = pick(job, [
      'channel',
      'clippedBy',
      'programName',
      'programDate',
      'programTime',
      'segmentStartTime',
      'segmentTime',
      'thumbnailPath',
      'channelLogoPath',
      'videoPath',
      'broadcastDate',
    ]);
    const tabOneContent = (
      <Statement
        Ttype="Transcription"
        isClient={true}
        transcription={job?.transcription}
        saveIcon={job.id}
        jobId={job?.id}
        setDisable={setDisable}
        programInfo={programInfo}
        language={job?.language?.toLowerCase()}
        user={getUser()}
        extras={false}
        PlayCheck={PlayCheck}
        searchText={searchText}
        handleOnchange={handleOnchange}
        statementFontSize={statementFontSize}
      />
    );

    const tabTwoContent = (
      <div className="tv-job-details-tab-content">
        <p className="fs-xs fw-600">{job.channel}</p>
        <p className="fs-md fw-400">
          <span className=" fw-600">Title: </span>
          {job?.programName}
        </p>
        <p className="fs-md fw-400">
          <span className=" fw-600">Speakers: </span>
          {job?.anchor?.join(', ')}
        </p>
        <p className="fs-md fw-400">
          <span className=" fw-600">Guests: </span>
          {job?.guests?.join(', ')}
        </p>

        <p className="fs-md fw-400">
          <span className=" fw-600">Date & Time: </span>
          {moment?.utc(job?.broadcastDate)?.format('hh:mm A') || ''} ({' '}
          {moment(job?.broadcastDate).format('DD MMM YYYY')} )
        </p>
      </div>
    );
    const tvDetails = (
      <V3Tabs
        varient={'secondary'}
        tabPanes={[
          { title: 'Transcript', content: tabOneContent },
          { title: 'Details', content: tabTwoContent },
        ]}
      />
    );

    return tvDetails;
  }

  if (job?.source === 'Blog') {
    const webDetailsPreview = (
      <div className="web-job-details-preview">
        <span className="fs-xs fw-600 ff-roboto d-block mb-10">{job?.channel}</span>
        <span
          style={{ fontFamily: checkFontLanguage(job.programName) }}
          className={`fs-lg fw-600 d-block mb-10 ${checkLanguageDirection(job.programName)}`}
        >
          {job?.programName}
        </span>

        <span className="d-block mb-10">
          <span className="fs-sm fw-500 fc-grey-light">
            By <span className="text-underline">Publisher Name </span>
          </span>
          <span className="fc-grey-light inline-block p-inline-1"> | </span>
          <span className="fs-sm fw-500 fc-grey-light">
            {moment(job?.broadcastDate).format('DD MMM YYYY')}
          </span>
        </span>

        <Statement
          Ttype="Transcription"
          // height="300px"
          isClient={true}
          searchText={searchText}
          // content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
          transcription={job?.transcription}
          jobId={job?.id}
          language={job?.language?.toLowerCase()}
          extras={false}
          statementFontSize={statementFontSize}
        />
      </div>
    );
    return webDetailsPreview;
  }

  if (job.source === 'Social' || job.source === 'Ticker') {
    const tickerSocialDetailsPreview = (
      <div className="ticker-social-details-preview">
        <Statement
          Ttype="Transcription"
          // height="300px"
          isClient={true}
          searchText={searchText}
          // content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
          transcription={job?.transcription}
          jobId={job?.id}
          language={job?.language?.toLowerCase()}
          extras={false}
          statementFontSize={statementFontSize}
        />
      </div>
    );

    return tickerSocialDetailsPreview;
  }

  if (job?.source === 'Print') {
    const printDetailsPreview = (
      <div className="print-details-preview-wrapper">
        <Statement
          Ttype="Transcription"
          // height="300px"
          isClient={true}
          searchText={searchText}
          // content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
          transcription={job?.transcription}
          jobId={job?.id}
          language={job?.language?.toLowerCase()}
          extras={false}
          statementFontSize={statementFontSize}
        />
      </div>
    );
    return printDetailsPreview;
  }
  return <div>details</div>;
};
