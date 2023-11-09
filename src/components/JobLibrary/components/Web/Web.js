import { Image } from 'antd';
import { Button } from 'components/Common';
import { uploadPath } from 'constants/index';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { formatDate, sourceBtn } from 'modules/common/utils';
import React from 'react';
import './Web.scss';

const Web = ({ job }) => {
  const checkFontLanguage = str => {
    const urduRegex = /[\u0600-\u06FF]/; // matches any Urdu characters
    const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
    return hasUrdu ? 'urdu' : 'english'; // return "rtl" if the string has Urdu characters, otherwise "ltr"
  };

  const showWriter = ['Print', 'Blog'];

  return (
    <>
      <div className="drawer-details-div">
        <div className="details-sub-div">
          <span className="headingName">{job.channel}</span>
          <div className="date-section">
            <span style={{ marginTop: '1%', marginRight: '17px', fontWeight: '700' }}>
              {`${formatDate(
                job.broadcastDate ? job.broadcastDate : job.programDate,
                'DD MMM YY'
              )}`}
            </span>
            <Button
              style={{
                minWidth: '42px',
                minHeight: '15px',
                marginRight: '15px',
                borderRadius: '2px',
                alignItems: 'center',
                color: sourceBtn(job?.source),
                display: 'flex',
              }}
            >
              {job.source === 'Blog' ? 'Web' : job.source === 'Social' ? 'Twitter' : job.source}
            </Button>
          </div>
        </div>
        <span className={`writer-span ${checkFontLanguage(job.publisher)}`}>
          {showWriter.includes(job.source) && job.publisher.length > 0
            ? `Writer - ${job.publisher}`
            : ''}
        </span>
      </div>
      <div className="image-section">
        <div
          className="headlineSection"
          style={{ direction: job.language === 'URDU' ? 'rtl' : 'ltr' }}
        >
          <div
            className={
              job.source === 'Print'
                ? `headline ${checkFontLanguage(job.headlines.headlineOne)}`
                : `headline ${checkFontLanguage(job.programName)}`
            }
          >
            {job.source === 'Print' ? job.headlines.headlineOne : job.programName}
          </div>
        </div>
        <div className="thumbnailSection">
          <Image
            src={`${USERS_BASE_URL}/${uploadPath}/${job.thumbnailPath}`}
            height={136}
            width={'100%'}
            preview={false}
            className="article-image"
            fallback="placeholder.png"
          ></Image>
        </div>
      </div>
    </>
  );
};

export default Web;
