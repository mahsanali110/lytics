import { Row, Col, Image, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
const { Text } = Typography;
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { uploadPath } from 'constants/index';
import { sourceBtn, checkLanguageDirection, checkFontLanguage } from 'modules/common/utils';
// import { Statement } from 'components/Common';
import { IconButton, Statement } from '../';

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
  // if (tvOnline) console.log('panels');

  const panels = results
    ? results?.map(job => {
        const header = (
          <Row
            className="job-card-header"
            gutter={8}
            align={'middle'}
            // onClick={() => {
            //   console.log(job.id, currentJob.id);
            //   if (job.id === currentJob.id) return;
            //   getJobById(job?.id);
            // }}
            onDoubleClick={e => {
              e.stopPropagation();
              console.log(job.id, currentJob.id);
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
                //   width={'100%'}
                //   height={'100%'}
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
              <Row
                // className="flex-column"
                style={{ height: '100%' }}
              >
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
                          {' '}
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
              // content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
              transcription={job?.transcription}
              jobId={job?.id}
              language={job?.language?.toLowerCase()}
              extras={false}
            />
          </div>
        );

        const contentPrintWeb = (
          <Row className="content-wrapper print-web">
            <Col span={24}>
              {/* Header with Picture  */}
              <Row align={'middle'} justify={'space-between'}>
                <Col span={10}>
                  {/* Headin + Writer name  */}
                  <Row>
                    <Col span={24}>
                      {' '}
                      <Text
                        style={{
                          display: 'inline-block',
                          fontFamily: checkFontLanguage(job.programName),
                          width: '100%',
                        }}
                        className={`text-white job-heading ${checkLanguageDirection(
                          job.programName
                        )}`}
                      >
                        {job?.programName}
                      </Text>
                    </Col>
                    <Col span={24}>
                      <Text className="text-white job-publisher">Writer - {job?.publisher}</Text>
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
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
                <Col span={24} className="mt-15">
                  <Text
                    style={{
                      display: 'inline-block',
                      fontFamily: checkFontLanguage(job.programName),
                      width: '100%',
                      fontSize: '12px',
                    }}
                    className={`text-white social-heading ${checkLanguageDirection(
                      job.programName
                    )}`}
                  >
                    {job?.transcription?.reduce((accumulator, { line }) => {
                      return `${accumulator} ${line}`;
                    }, '')}
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}></Col>
          </Row>
        );

        const headerSocial = (
          <Row className="job-card-header header-social p-5" justify={'space-between'}>
            <Col>
              <Row align={'middle'} gutter={8}>
                <Col className="center-content">
                  <span className="dot-bg"></span>
                </Col>
                <Col>
                  <Text className="text-white job-anchor"> {job?.channel}</Text>
                </Col>
              </Row>
            </Col>
            <Col>
              <IconButton title={'Twitter'} iconDetails={{ source: 'Twitter' }} transparent />
            </Col>
            <Col span={24}>
              {/* <Statement
                Ttype="Transcription"
                height="300px"
                isClient={true}
                content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
                language={job?.language?.toLowerCase()}
                extras={false}
              /> */}
              <Text
                style={{
                  display: 'inline-block',
                  fontFamily: checkFontLanguage(job.programName),
                  width: '100%',
                }}
                className={`text-white social-heading ${checkLanguageDirection(job.programName)}`}
              >
                {job.programName}
                {/* {job?.transcription?.reduce((accumulator, { line }) => {
                  return `${accumulator} ${line}`;
                }, '')} */}
              </Text>
            </Col>
            <Col span={24}>
              <Row justify={'end'} align={'middle'} className="text-white" gutter={8}>
                <Col>
                  <CalendarOutlined /> {moment(job.programDate).format('DD MMM YY')}
                </Col>
                <Col className="dot"></Col>
                <Col>{job?.programTime && job?.programTime.split('to')[0]}</Col>
              </Row>
            </Col>
          </Row>
        );

        const contentSocial = (
          <Row className="content-social p-5" align={'middle'} gutter={8}>
            <Col className="center-content">
              {' '}
              <span className="dot-bg"></span>
            </Col>
            <Col className="center-content">
              <Text className="text-white user"> {job?.channel}</Text>
            </Col>
            <Col className="center-content">
              <Text className="text-white program-user"> {job?.programUser}</Text>
            </Col>
            <Col span={24}>
              {/* <Statement
                Ttype="Transcription"
                height="auto"
                isClient={true}
                content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
                language={job?.language?.toLowerCase()}
                extras={false}
              /> */}
              <Text
                style={{
                  display: 'inline-block',
                  fontFamily: checkFontLanguage(job.programName),
                  width: '100%',
                }}
                className={`text-white social-heading ${checkLanguageDirection(job.programName)}`}
              >
                {/* {job.programName} */}
                {job?.transcription?.reduce((accumulator, { line }) => {
                  return `${accumulator} ${line}`;
                }, '')}
              </Text>
            </Col>
          </Row>
        );

        const headerTicker = (
          <Row className="job-card-header header-social p-5">
            <Col span={24}>
              <Row justify={'space-between'} align={'middle'}>
                <Col>
                  <Text className="text-white job-anchor">{job?.channel}</Text>
                </Col>
                <Col>
                  <IconButton
                    title={job?.source}
                    iconDetails={{ source: job?.source }}
                    transparent
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={8} style={{ margin: '8px 0', flexWrap: 'nowrap' }}>
                <Col>
                  <Image
                    src={
                      job?.channelLogoPath?.length > 0
                        ? `${USERS_BASE_URL}/${uploadPath}/${job.channelLogoPath}`
                        : ''
                    }
                    style={{
                      width: '40px',
                      aspectRatio: '1',
                      borderRadius: '6px',
                      objectFit: 'contain',
                    }}
                    //   width={'100%'}
                    //   height={'100%'}
                    fallback="placeholder.png"
                    preview={false}
                    loading="lazy"
                  />
                </Col>
                <Col style={{ flexGrow: '1' }}>
                  <Text
                    style={{
                      display: 'inline-block',
                      fontFamily: checkFontLanguage(job.programName),
                      fontSize: '12px',
                      lineHeight: '30px',
                      width: '100%',
                    }}
                    className={`text-white job-anchor ${checkLanguageDirection(job.programName)}`}
                  >
                    {job?.programName}
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify={'end'} align={'middle'} className="text-white" gutter={8}>
                <Col>
                  <CalendarOutlined /> {moment(job.programDate).format('DD MMM YY')}
                </Col>
                <Col className="dot"></Col>
                <Col>{job?.programTime && job?.programTime.split('to')[0]}</Col>
              </Row>
            </Col>
          </Row>
        );

        const contentTicker = (
          <Row className="content-ticker">
            <Col span={24}>
              <Image
                src={
                  job?.thumbnailPath?.length > 0
                    ? `${USERS_BASE_URL}/${uploadPath}/${job.thumbnailPath}`
                    : ''
                }
                className="w-100"
                style={{ width: '100%' }}
                //   width={'100%'}
                //   height={'100%'}
                fallback="placeholder.png"
                preview={false}
                loading="lazy"
              />
            </Col>
            <Col span={24}>
              {/* <Statement
                Ttype="Transcription"
                height="auto"
                isClient={true}
                content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
                language={job?.language?.toLowerCase()}
                extras={false}
              /> */}
              <Text
                style={{
                  display: 'inline-block',
                  fontFamily: checkFontLanguage(job.programName),
                  width: '100%',
                  background: '#121a34',
                  padding: '10px',
                }}
                className={`text-white social-heading ${checkLanguageDirection(job.programName)}`}
              >
                {/* {job.programName} */}
                {job?.transcription?.reduce((accumulator, { line }) => {
                  return `${accumulator} ${line}`;
                }, '')}
              </Text>
            </Col>
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
