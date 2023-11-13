import React from 'react';
import { Row, Col, Typography, IconButton } from '@mui/material';
import { CalendarOutlined } from '@mui/icons-material';
import moment from 'moment';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { uploadPath } from 'constants/index';
import { sourceBtn, checkLanguageDirection, checkFontLanguage } from 'modules/common/utils';
import { Statement } from '../'; // Assuming Statement is correctly implemented in Mui
import Image from '@mui/material/Image';

const { Text } = Typography;

function getPannels(
  results,
  getJobById,
  playCheck,
  setPlayCheck,
  tvOnline,
  currentJob,
  videoCurrentTime,
  handlePreviewPlaying
) {
  const panels = results
    ? results?.map(job => {
        const header = (
          <Row
            className="job-card-header"
            gutter={8}
            align={'middle'}
            onDoubleClick={e => {
              e.stopPropagation();
              if (!['Tv', 'Online'].includes(job.source)) return;
              getJobById(job?.id);
              handlePreviewPlaying(true);
            }}
          >
            <Col span={6} className="center-content">
              <Image
                src={
                  job?.thumbnailPath?.length > 0
                    ? `${USERS_BASE_URL}/${uploadPath}/${job.thumbnailPath}`
                    : ''
                }
                style={{ width: '100%', aspectRatio: '1', objectFit: 'contain' }}
                fallback={
                  job?.channelLogoPath
                    ? `${USERS_BASE_URL}/${uploadPath}/${job.channelLogoPath}`
                    : 'placeholder.png'
                }
                preview={false}
                loading="lazy"
              />
            </Col>
            <Col span={18} className="p-5">
              <Row style={{ height: '100%' }}>
                <Col span={24}>
                  <Row gutter={8}>
                    <Col span={18}>
                      <Text
                        style={{
                          display: 'inline-block',
                          fontFamily: checkFontLanguage(job.programName),
                          width: '100%',
                        }}
                        className={`text-white job-title ${checkLanguageDirection(
                          job.programName
                        )}`}
                      >
                        {job.programName}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Row align={'bottom'} style={{ flexDirection: 'column' }}>
                        <Col>
                          <IconButton
                            title={
                              job?.source === 'Blog'
                                ? 'Web'
                                : job?.source === 'Tv'
                                ? 'TV'
                                : job?.source
                            }
                            iconDetails={{ source: job?.source }}
                            transparent
                          />
                        </Col>
                        <Col>
                          <Text
                            style={{ display: 'inline-block', padding: '5px 0' }}
                            className="text-white job-channel-name"
                          >
                            {job.channel}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Text
                    className="text-white job-topic"
                    style={{
                      color: sourceBtn(job.source),
                    }}
                  >
                    {job?.segments[0]?.topics.topic1} |{' '}
                    <span style={{ fontWeight: 'bolder' }}>
                      {job?.segments[0]?.topics.topic2[0]}
                    </span>
                  </Text>
                </Col>
                <Col className="text-white" style={{ alignSelf: 'flex-end' }} span={24}>
                  <Row justify={'space-between'}>
                    <Col>
                      <Text className="text-white job-anchor">{job.anchor[0]}</Text>
                    </Col>
                    <Col>
                      <Row align={'middle'} gutter={8}>
                        <Col>
                          <CalendarOutlined /> {moment(job.broadcastDate).format('DD MMM YY')}
                        </Col>
                        <Col className="dot"></Col>
                        <Col>{moment?.utc(job?.broadcastDate)?.format('hh:mm A') || ''}</Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        );

        const content = (
          <div className="content-wrapper">
            <Statement
              Ttype="Transcription"
              height="300px"
              isClient={true}
              transcription={job?.transcription}
              jobId={job?.id}
              language={job?.language?.toLowerCase()}
              extras={false}
            />
          </div>
        );

        // Assuming IconButton is correctly implemented in Mui
        const contentPrintWeb = (
          <Row className="content-wrapper print-web">
            {/* ... (Content for print and web) */}
          </Row>
        );

        // Assuming IconButton is correctly implemented in Mui
        const headerSocial = (
          <Row className="job-card-header header-social p-5" justify={'space-between'}>
            {/* ... (Header for social) */}
          </Row>
        );

        // Assuming IconButton is correctly implemented in Mui
        const contentSocial = (
          <Row className="content-social p-5" align={'middle'} gutter={8}>
            {/* ... (Content for social) */}
          </Row>
        );

        // Assuming IconButton is correctly implemented in Mui
        const headerTicker = (
          <Row className="job-card-header header-social p-5">
            {/* ... (Header for ticker) */}
          </Row>
        );

        // Assuming IconButton is correctly implemented in Mui
        const contentTicker = (
          <Row className="content-ticker">
            {/* ... (Content for ticker) */}
          </Row>
        );

        if (job?.source === 'Blog' || job?.source === 'Print')
          return { header, content: contentPrintWeb, key: job?.id };

        if (job?.source === 'Online' || job?.source === 'Tv')
          return { header, content, key: job?.id };
        if (job?.source === 'Social')
          return { header: headerSocial, content: contentSocial, key: job?.id };
        if (job?.source === 'Ticker')
          return { header: headerTicker, content: contentTicker, key: job?.id };
      })
    : [];

  return panels;
}

export default getPannels;
