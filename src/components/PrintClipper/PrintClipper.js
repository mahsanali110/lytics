import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message as antMessage } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import './PrintClipper.scss';

import programNamesActions from 'modules/programNames/actions';
import channelsActions from 'modules/channels/actions';
import writersActions from 'modules/writers/actions';
import programTypesActions from 'modules/programTypes/actions';
import commonActions from 'modules/common/actions';
import printClipperActions from 'modules/printClipper/actions';
import { CHANNEL_LANGUAGE, CHANNEL_REGION } from 'constants/strings';

import {
  getTopicKeys,
  getTopicValue,
  getTopicKeyFromValue,
  isNewTopic,
  getUser,
  numList,
} from 'modules/common/utils';

import { Select, TreeSelect, Button, DatePicker } from 'components/Common';
import { Input, Upload } from './components';
import moment from 'moment-timezone';

function PrintClipper() {
  const dispatch = useDispatch();
  const { formDetails, loading } = useSelector(state => state.printClipperReducer);
  const { topicsError, hashtagsError } = useSelector(state => state.commonReducer);
  const topicMap = useSelector(state => state.commonReducer.topicMap);
  const state = useSelector(state => state);
  const { channels } = state.channelsReducer;
  const { writers } = state.writersReducer;
  const { programTypes } = state.programTypesReducer;

  const [jobRecord, setJobRecord] = useState({ ...formDetails });
  const [file1, setFile1] = useState([]);
  const [file2, setFile2] = useState([]);
  const [file3, setFile3] = useState([]);
  const [file4, setFile4] = useState([]);
  const [topics, setTopics] = useState({ topic1: '', topic2: [], topic3: [] });

  const fetchDefaultData = () => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(commonActions.fetchTopics.request());
    dispatch(channelsActions.getChannels.request());
    dispatch(writersActions.getWriters.request());
  };

  useEffect(() => {
    fetchDefaultData();
  }, []);

  useEffect(() => {
    console.log({ jobRecord });
  }, [jobRecord]);

  useEffect(() => {
    setJobRecord({ ...formDetails });
    setTopics({ topic1: '', topic2: [], topic3: [] });
    setFile1([]);
    setFile2([]);
    setFile3([]);
    setFile4([]);
  }, [formDetails]);

  const handleChange = (field, value) => {
    setJobRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (fileNo, { fileList }) => {
    if (fileNo === 'file1') setFile1(fileList);
    if (fileNo === 'file2') setFile2(fileList);
    if (fileNo === 'file3') setFile3(fileList);
    if (fileNo === 'file4') setFile4(fileList);
  };

  const handleTopicChange = (val, node, extra) => {
    if (
      topics?.topic3?.length &&
      extra.checked &&
      isNewTopic(
        getTopicKeyFromValue(topics?.topic3[0], topicMap, topics?.topic1),
        extra?.triggerValue
      )
    ) {
      return antMessage.error('Max topic 1 limit reached', 2);
    }
    let topic1 = '',
      topic2 = [];
    // get the values for topic1 and topic 2
    if (val.length) {
      const { topic1Key, topic2Keys } = getTopicKeys(val, true, true);
      topic1 = getTopicValue(topic1Key, topicMap, true);
      topic2 = getTopicValue(topic2Keys, topicMap, true);
    }
    setTopics({ topic1, topic2, topic3: node });
    // dispatch(changeTopic3({ index, field: 'topic3', value: { topic1, topic2, topic3: node } }));
  };

  const handleSubmit = () => {
    if (!jobRecord.channel) {
      return antMessage.error('"Name fo Newspaper" is required');
    } else if (!jobRecord.date) {
      return antMessage.error('"Publish Date" is required');
    } else if (!jobRecord.pageNumber) {
      return antMessage.error('"Page Number" is required');
    } else if (!jobRecord.writer) {
      return antMessage.error('"Writer" is required');
    } else if (!jobRecord.programType) {
      return antMessage.error('"News Type" is required');
    } else if (!jobRecord.programType) {
      return antMessage.error('"News Type" is required');
    } else if (!jobRecord.language) {
      return antMessage.error('"Language" is required');
    } else if (!jobRecord.region) {
      return antMessage.error('"Region" is required');
    } else if (!file1.length) {
      return antMessage.error('Thumbnail image is required');
    } else if (!jobRecord.headLine1) {
      return antMessage.error('First article headline is required');
    } else if (!file2.length & !file3.length & !file4.length) {
      return antMessage.error('At least one article image is required');
    } else if (!topics.topic1) {
      return antMessage.error('At least one topic is required');
    } else {
      const { firstName, lastName } = getUser();
      const clippedBy = [firstName, lastName].join(' ');

      const form = new FormData();
      form.append('clippedBy', clippedBy);
      form.append('channel', jobRecord.channel);
      form.append('date', jobRecord.date);
      form.append('pageNumber', jobRecord.pageNumber);
      form.append('writer', jobRecord.writer);
      form.append('programType', jobRecord.programType);
      form.append('language', jobRecord.language);
      form.append('region', jobRecord.region);
      form.append('headLine1', jobRecord.headLine1);
      form.append('headLine2', jobRecord.headLine2);
      form.append('headLine3', jobRecord.headLine3);
      form.append('topic1', topics.topic1);
      form.append('topic2', topics.topic2);
      form.append('topic3', topics.topic3);
      if (file1[0]?.originFileObj) form.append('files', file1[0]?.originFileObj);
      for (var i = 0; i < file2.length; i++) {
        if (file2[i]?.originFileObj) form.append('files', file2[i]?.originFileObj);
      }
      dispatch(printClipperActions.createJob.request(form));
    }
  };

  return (
    <div className="print-clipper-wrapper">
      {/*Main Heading */}
      <Row gutter={[12, 6]} className="main-row">
        <Col className="print-clipper-col" span={24}>
          <div className="main-heading">Print Clipper Form</div>
        </Col>

        {/* Publisher Info start*/}
        <Col className="print-clipper-col col-gap" span={12}>
          <Row>
            <Col span={24}>
              <div className="sub-heading">Publishing Information</div>
              <div className="d-flex">
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Name of Newspaper</label>
                  </Col>
                  <Col span={24}>
                    <Select
                      placeholder={'select'}
                      options={channels
                        .filter(cha => cha.type == 'Print')
                        .map(cha => ({ value: cha.name, title: cha.name }))}
                      value={jobRecord.channel}
                      onChange={value => handleChange('channel', value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Published Date</label>
                  </Col>
                  <Col span={24}>
                    <DatePicker
                      value={jobRecord.date ? moment(jobRecord.date) : null}
                      onChange={(_, str) => handleChange('date', str)}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Page number</label>
                  </Col>
                  <Col span={24}>
                    <Select
                      placeholder={'select'}
                      options={numList(20).map(num => ({
                        value: num,
                        title: num,
                      }))}
                      value={jobRecord.pageNumber}
                      onChange={value => handleChange('pageNumber', value)}
                      style={{ width: '100%' }}
                      optionSort={false}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Writer</label>
                  </Col>
                  <Col span={24}>
                    <Select
                      placeholder={'select'}
                      options={writers.map(({ name }) => ({ value: name, title: name }))}
                      value={jobRecord.writer}
                      onChange={value => handleChange('writer', value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
        {/* Publisher Info end*/}

        {/*Metadata start*/}
        <Col className="print-clipper-col col-gap" span={12}>
          <Row>
            <Col span={24}>
              <div className="sub-heading">Metadata</div>
              <div className="d-flex">
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Type of News</label>
                  </Col>
                  <Col span={24}>
                    <Select
                      placeholder={'select'}
                      options={programTypes
                        .filter(type => type.source === 'Print')
                        .map(({ name }) => ({ value: name, title: name }))}
                      value={jobRecord.programType}
                      onChange={value => handleChange('programType', value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Language</label>
                  </Col>
                  <Col span={24}>
                    <Select
                      placeholder={'select'}
                      value={jobRecord.language}
                      onChange={value => handleChange('language', value)}
                      options={CHANNEL_LANGUAGE.map(language => ({
                        title: language,
                        value: language,
                      }))}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Region</label>
                  </Col>
                  <Col span={24}>
                    <Select
                      placeholder={'select'}
                      value={jobRecord.region}
                      onChange={value => handleChange('region', value)}
                      options={CHANNEL_REGION.map(region => ({ title: region, value: region }))}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
        {/*Metadata end*/}

        {/* Artical image start*/}
        <Col className="print-clipper-col col-gap" span={12}>
          <Row>
            <Col span={24}>
              <div className="sub-heading">Import Images</div>
              <div className="d-flex">
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Article Image</label>
                  </Col>
                  <Col span={24}>
                    <Upload
                      fileList={file1}
                      onChange={info => handleImageChange('file1', info)}
                      maxCount={1}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
        {/* Artical image end*/}

        {/* Topic start*/}
        <Col className="print-clipper-col col-gap" span={12}>
          <Row>
            <Col span={24}>
              <div className="sub-heading">Topics</div>
              <Row>
                <Col span={16}>
                  <Spin spinning={topicsError} delay={500}>
                    <TreeSelect
                      value={getTopicKeyFromValue(topics.topic3, topicMap, topics.topic1)}
                      handleOnChange={handleTopicChange}
                      treeData={state.commonReducer.topics}
                      placeholder="Search topics"
                    />
                  </Spin>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* Topic end*/}

        {/* Headlines start*/}
        <Col className="print-clipper-col" span={24}>
          <Row>
            <Col span={24}>
              <div className="sub-heading">Headlines</div>
              <Row gutter={[0, 16]}>
                <Col span={20}>
                  <Input
                    value={jobRecord.headLine1}
                    onChange={value => handleChange('headLine1', value.trim())}
                    placeholder={'Headline 1'}
                  />
                </Col>
                <Col span={20}>
                  <Input
                    value={jobRecord.headLine2}
                    onChange={value => handleChange('headLine2', value.trim())}
                    placeholder={'Headline 2'}
                  />
                </Col>
                <Col span={20}>
                  <Input
                    value={jobRecord.headLine3}
                    onChange={value => handleChange('headLine3', value.trim())}
                    placeholder={'Headline 3'}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* Headlines end*/}

        {/* Article Images start*/}
        <Col className="print-clipper-col" span={24}>
          <Row>
            <Col span={18}>
              <div className="sub-heading">Import Images</div>
              <div className="d-flex">
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Article Image</label>
                  </Col>
                  <Col span={24}>
                    <Upload
                      fileList={file2}
                      onChange={info => handleImageChange('file2', info)}
                      // maxCount={1}
                      multiple
                    />
                  </Col>
                </Row>

                {/* <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Article Image</label>
                  </Col>
                  <Col span={24}>
                    <Upload
                      fileList={file3}
                      onChange={info => handleImageChange('file3', info)}
                      maxCount={1}
                    />
                  </Col>
                </Row>

                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <label className="label">Article Image</label>
                  </Col>
                  <Col span={24}>
                    <Upload
                      fileList={file4}
                      onChange={info => handleImageChange('file4', info)}
                      maxCount={1}
                    />
                  </Col>
                </Row> */}
              </div>
            </Col>
          </Row>
        </Col>
        {/* Article Images end*/}

        {/* Submit start*/}
        <Col className="print-clipper-col" span={24}>
          <Row justify="center">
            <Col>
              {' '}
              <Button
                onClick={handleSubmit}
                loading={loading}
                extraClass={'print-clipper-submit-button'}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Col>
        {/* Submit end*/}
      </Row>
    </div>
  );
}

export default PrintClipper;
