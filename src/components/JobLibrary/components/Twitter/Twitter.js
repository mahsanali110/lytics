import { Image } from 'antd';
import { Button } from 'components/Common';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { formatDate, sourceBtn } from 'modules/common/utils';
import React from 'react';
import TwitterLogo from 'assets/images/Twitterlogo.png';
import './Twitter.scss';

const Twitter = ({ job, programInfo, programTime }) => {
  return (
    <div className="drawer-details-div">
      {job.source == 'Social' ? (
        <Image
          src={TwitterLogo}
          width={'100%'}
          height={'100%'}
          fallback="placeholder.png"
          preview={false}
        ></Image>
      ) : (
        ''
      )}
      <div className="details-sub-div">
        {job.source == 'Ticker' ? (
          <Image
            src={
              programInfo?.thumbnailPath ? `${USERS_BASE_URL}/uploads/${job.channelLogoPath}` : ''
            }
            width={'10%'}
            height={'10%'}
            fallback="placeholder.png"
            preview={false}
          ></Image>
        ) : (
          <Image
            src={
              programInfo?.thumbnailPath
                ? `${USERS_BASE_URL}/uploads/${programInfo.thumbnailPath}`
                : ''
            }
            width={'10%'}
            height={'10%'}
            className={'profileImage'}
            fallback="placeholder.png"
            preview={false}
          ></Image>
        )}

        <span className="headingName">{job.channel}</span>
        <div className="date-section">
          <span style={{ marginTop: '1%', marginRight: '3.5%' }}>
            {`${formatDate(job.programDate, 'DD MMM YY')} . ${
              programTime !== undefined && programTime.length ? programTime : '12:00AM'
            }`}
          </span>
          <Button
            style={{
              minWidth: 'fit-content',
              minHeight: 'fit-content',
              borderRadius: '2px',
              color: sourceBtn(job?.source),
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {job.source === 'Blog' ? 'Web' : job.source === 'Social' ? 'Twitter' : job.source}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Twitter;
