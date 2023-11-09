import React, { useState, useEffect } from 'react';
import { SegmentContainer, Button, Select, Card } from 'components/Common';
import { Typography, Tooltip, Form, Input, Checkbox, Skeleton, Space } from 'antd';
import { TOOLTIP_COLORS } from 'constants/options';
import { RedoOutlined } from '@ant-design/icons';
import { formatDate, formateTime } from 'modules/common/utils';
import { useDispatch, useSelector } from 'react-redux';
import guestsActions from 'modules/guests/actions';
import { PRIORITY_COLORS } from 'constants/options';
import contentExportActions from 'modules/contentExport/action';
import { message as antMessage } from 'antd';
import image from 'assets/images/image.jpg';
import { MinusCircleFilled, CloseCircleTwoTone } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

import './youtube.scss';
const { Text } = Typography;

function Youtube({
  programInfo,
  channel,
  refresh,
  programTypes,
  hosts,
  programNames,
  process,
  setProcess,
  handleSubmit,
  processExport,
  setProcessExport,
  transcriptionFlag,
  settranscriptionFlag,
  setContentInfo,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(guestsActions.getGuests.request());
  }, []);

  const { guests, loading } = useSelector(state => state.guestsReducer);
  const onChange = ({ field, value }) =>
    setProcess(prev => ({
      ...prev,
      [field]: value,
    }));
  const [ChannelProgramName, setChannelProgramName] = useState([]);
  const [ChannelALLProgramName, setChannelALLProgramName] = useState([]);
  const [ChannelHostName, setChannelHostName] = useState([]);
  const [seletedProgramName, setseletedProgramName] = useState('');
  const [seletedProgramType, setseletedProgramType] = useState('');
  const [checkparticipent, setcheckparticipent] = useState(false);
  const [checkAnchor, setcheckAnchor] = useState(true);
  const [selectedProgram, setselectedProgramm] = useState([]);
  const [Job, setJob] = useState(null);

  return (
    <div className="content-export-parent">
      <SegmentContainer title="Youtube" color="#B6203B" variant="secondary">
        <Card
          bg="dark"
          variant="secondary"
          content={
            <section className="process-wrapper">
              <div>
                {programInfo?.channelLogoPath !== undefined ? (
                  <>
                    <div className="grey-box">
                      <section className="card-detail-body mt-10">
                        <div className="sub-heading">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Text
                              className="text-primary medium-font-size"
                              style={{
                                // color: 'rgba(242, 106, 50, 1)',
                                textAlign: 'left',
                                fontSize: '18px',
                              }}
                            >
                              {programInfo?.channel}
                            </Text>
                            <Text
                              style={
                                {
                                  // color: 'rgba(242, 106, 50, 1)',
                                }
                              }
                              className="text-primary small-font-size"
                            >
                              {programInfo?.programDate}
                            </Text>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <div className="">
                              <img
                                height="30px"
                                width="30px"
                                src={programInfo?.channelLogoPath}
                                alt=""
                                crossOrigin="Anonymous"
                              />
                            </div>
                          </div>
                        </div>

                        <Form layout="vertical">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Form.Item label="Title" required style={{ width: '45%' }}>
                              <Select
                                value={process.programType}
                                size="small"
                                allowClear
                                onChange={value => {
                                  onChange({ field: 'programType', value });
                                  setseletedProgramType(value);
                                }}
                                options={programTypes.map(({ name }) => ({
                                  title: name,
                                  value: name,
                                }))}
                              />
                            </Form.Item>
                            <Form.Item label="Category" required style={{ width: '45%' }}>
                              <Select
                                value={process.programName}
                                size="small"
                                allowClear
                                onChange={value => {
                                  onChange({ field: 'programName', value }),
                                    setseletedProgramName(value);
                                }}
                                options={ChannelProgramName.map(({ title }) => ({
                                  title,
                                  value: title,
                                }))}
                              />
                            </Form.Item>
                          </div>
                          <Form.Item label="Tags" required={checkAnchor}>
                            <Select
                              value={process.anchor}
                              mode="multiple"
                              size="small"
                              allowClear
                              onChange={value => onChange({ field: 'anchor', value })}
                              options={ChannelHostName.map(name => ({ title: name, value: name }))}
                            />
                          </Form.Item>
                          <div style={{ margin: '10px 0', fontSize: '11px', color: '#BDBDC1' }}>
                            Thumbnail
                          </div>
                          <div className="social-thumbnail">
                            <div className="main-thumbnail">
                              <img style={{ width: '100%' }} src={image} />
                            </div>
                            <div className="thumbnails">
                              <div className="child-thumbnail">
                                <img style={{ width: '100%' }} src={image} />
                              </div>
                              <div className="child-thumbnail">
                                <img style={{ width: '100%' }} src={image} />
                              </div>
                              <div className="child-thumbnail">
                                <img style={{ width: '100%' }} src={image} />
                              </div>
                              <div className="child-thumbnail">
                                <img style={{ width: '100%' }} src={image} />
                              </div>
                            </div>
                          </div>
                          <Form.Item label="News">
                            <TextArea
                              style={{ height: '10rem' }}
                              value={process.comments}
                              onChange={e => onChange({ field: 'comments', value: e.target.value })}
                              className="bg-light-grey"
                              rows={4}
                              placeholder="Caption"
                            />
                          </Form.Item>
                        </Form>
                      </section>
                      <div className="content-footer-social-youtube">
                        <button className="social-buttton">POST</button>
                      </div>
                      <CloseCircleTwoTone
                        className="window-close-icon"
                        style={{
                          position: 'absolute',
                          top: '-7px',
                          // left: '100%',
                          right: '-5px',
                          fontSize: '1.3rem',
                          height: '20px',
                          zIndex: '9999',
                          color: 'rgba(242, 106, 50, 1)',
                          marginTop: '5px',
                          marginRight: '10px',
                        }}
                        onClick={() => {
                          setContentInfo({});
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Card
                        bg="dark"
                        variant="secondary"
                        content={
                          <>
                            <Space
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '10px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  width: '350px',
                                }}
                              >
                                <div>
                                  <Skeleton.Avatar
                                    active={false}
                                    size={'default'}
                                    shape={'circle'}
                                  />
                                  <Skeleton.Input
                                    style={{
                                      width: 60,
                                      height: 20,
                                      borderRadius: '5px',
                                      marginLeft: '5px',
                                      marginTop: '6px',
                                    }}
                                    active={false}
                                    size={'default'}
                                  />
                                </div>
                                <Skeleton.Input
                                  style={{ width: 100, borderRadius: '5px' }}
                                  active={false}
                                  size={'default'}
                                />
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  marginTop: '20px',
                                }}
                              >
                                <div>
                                  <Skeleton.Input
                                    style={{ width: 355, borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                  <Skeleton.Input
                                    style={{ width: 107, borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 107, marginLeft: '15px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 107, marginLeft: '15px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                </div>
                              </div>
                            </Space>
                            <Skeleton.Input
                              style={{
                                width: 355,
                                height: 150,
                                marginTop: '20px',
                                borderRadius: '5px',
                              }}
                              active={false}
                              size={'default'}
                            />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                                marginBottom: '15px',
                              }}
                            >
                              <Skeleton.Input
                                style={{
                                  width: 107,
                                  borderRadius: '5px',
                                  marginTop: '5px',
                                }}
                                active={false}
                                size={'default'}
                              />
                              <Skeleton.Button
                                active={false}
                                size={'large'}
                                style={{ width: '120px', height: '40px', borderRadius: '10px' }}
                                shape={'default'}
                                block={true}
                              />
                            </div>
                          </>
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              {/* <div className="export-footer">
                <Button
                  disabled={Job === null}
                  onClick={() => {
                    dispatch(
                      contentExportActions.exportToDrive.request({ id: Job._id, data: Job })
                    );
                    setJob(null);
                  }}
                >
                  EXPORT
                </Button>
              </div> */}
            </section>
          }
        />
      </SegmentContainer>
    </div>
  );
}

export default Youtube;
