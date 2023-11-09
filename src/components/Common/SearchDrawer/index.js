import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Button, Row, Col, Form, Tag, DatePicker } from 'antd';
import { Select } from 'components/Common';
import { useSelector, useDispatch } from 'react-redux';
import { getUserId, SelectAll } from 'modules/common/utils';
import channelsActions from 'modules/channels/actions';
import programTypes from 'modules/programTypes/actions';
import hostsActions from 'modules/hosts/actions';
import guestsActions from 'modules/guests/actions';
import filterActions from 'modules/filter/actions';
import associationsActions from 'modules/associations/actions';
import usersActions from 'modules/users/actions';
import { DeleteOutlined } from '@ant-design/icons';
import './SearchDrawer.scss';
import moment from 'moment';

const SearchDrawer = ({ getDataFromChild, source: contentSource, drawerModel, setDrawerModel }) => {
  const dispatch = useDispatch();
  const d = new Date();
  const userId = getUserId();
  const [currentContent, setCurrentContent] = useState();
  const [defaultFilterId, setDefaultFilterId] = useState('');
  const [myChannels, setMyChannels] = useState(true);
  const [data, setData] = useState({
    tags: [],
    source: ['Tv', 'Online', 'Print', 'Blog', 'Social','Ticker'],
    channel: [],
    programType: [],
    hosts: [],
    guests: [],
    jobState: [
      'Ready for QC',
      'Ready for Marking',
      'Clipping',
      'Transcribing',
      'Completed',
      'Failed',
    ],
    association: null,
    escalation: [],
    start_date: moment().format(),
    start_date: moment(d).format('MM/DD/YYYY'),
    end_date: moment(d).format('MM/DD/YYYY'),
    programFromTime: moment(d).subtract(1, 'h').subtract(moment().minutes(), 'm').format('HH:mm'),
    programToTime: moment(d).format('HH:mm'),
  });

  const chanel = useRef();
  const restrict = useRef();
  chanel.current = true;
  const [placement, setPlacement] = useState('right');
  const [visible, setVisible] = useState(true);
  const [escalations, setEscalations] = useState({ title: 'All', value: 'All' });
  const { channels: dbchannels } = useSelector(state => state.channelsReducer);
  const { programTypes: programArr } = useSelector(state => state.programTypesReducer);
  const { hosts } = useSelector(state => state.hostsReducer);

  const { guests } = useSelector(state => state.guestsReducer);

  const { associations } = useSelector(state => state.associationsReducer);
  const { users } = useSelector(state => state.usersReducer);
  const getAscalations = () => {
    let arr = [
      ...users.map(role => ({
        value: role.firstName + ' ' + role.lastName,
        title: role.firstName + ' ' + role.lastName,
        id: role.id,
      })),
    ];

    let unique = [...new Map(arr.map(item => [item['value'], item])).values()];
    return unique;
  };
  const getAssociations = () => {
    let arr = [...associations?.map(guest => ({ value: guest?.name, title: guest?.name }))];
    let unique = [...new Map(arr.map(item => [item['value'], item])).values()];
    return unique;
  };

  useEffect(async () => {
    setData({
      tags: [],
      source:
        contentSource !== '' ? [contentSource] : ['All', 'Tv', 'Online', 'Print', 'Blog', 'Social','Ticker'],
      jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
      channel: [],
      programType: [],
      hosts: [],
      guests: [],
      association: [],
      escalation: [],
      start_date: moment().format(),
      start_date: moment(d).format('MM/DD/YYYY'),
      end_date: moment(d).format('MM/DD/YYYY'),
    });
    dispatch(channelsActions.getChannels.request());
    dispatch(programTypes.getProgramTypes.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(filterActions.getFilters.request(userId));
    dispatch(associationsActions.getAssociations.request());
    dispatch(usersActions.getUsers.request({ role: 'Reviewer' }));
  }, []);

  const onClose = () => {
    setDrawerModel(false);
    setVisible(false);
  };

  const Content = [
    {
      id: 0,
      name: 'All',
    },
    {
      id: 1,
      name: 'Tv',
    },
    {
      id: 2,
      name: 'Online',
    },
    {
      id: 3,
      name: 'Print',
    },
    {
      id: 4,
      name: 'Blog',
    },
    {
      id: 5,
      name: 'Social',
    },
    {
      id: 6,
      name: 'Ticker',
    },
  ];
  const clearData = () => {
    setData({
      ...data,
      source: [],
      jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
      channel: [],
      programType: [],
      hosts: [],
      guests: [],
      association: [],
      escalation: [],
      start_date: moment(d).subtract(1, 'days').format('MM/DD/YYYY'),
      end_date: moment(d).format('MM/DD/YYYY'),
    });
    setMyChannels(false);
  };

  useEffect(() => {
    myChannels
      ? dbchannels.map((channell, index) => {
          data.channel.push(channell.name);
        })
      : setData({ ...data, channel: [] });
  }, [dbchannels]);
  const dateFormat = 'MM/DD/YYYY';
  const format = 'HH:mm';

  const handleData = ({ type, value }) => {
    const array = data[type] ?? [];

    const index = array.indexOf(value);
    if (index !== -1) {
      array.splice(index, 1);
      setData(prev => ({ ...prev, [type]: array }));
    } else {
      if (type === 'channel' && data.channel.length == dbchannels.length - 1) {
        restrict.current = 'found';
        setMyChannels(true);
      }
      setData(prev => ({ ...prev, [type]: [...array, value] }));
    }
    if (data.channel?.length !== dbchannels?.length) {
      if (restrict.current !== 'found') {
        setMyChannels(false);
      }
    }
    restrict.current = '';
  };

  const applyFilter = () => {
    const diffTime = Math.abs(new Date(data.end_date) - new Date(data.start_date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 184) {
      alert('Days should be less than 6 months');
    } else {
      const { tags, ...rest } = data;
      getDataFromChild(rest);
    }
  };

  const handleChannels = () => {
    setMyChannels(!myChannels);
    chanel.current = !myChannels;
    chanel.current
      ? dbchannels.map((channell, index) => {
          if (!data.channel.includes(channell.name)) data.channel.push(channell.name);
        })
      : setData({ ...data, channel: [] });
  };

  const onSearch1 = val => {};
  const cancel = () => {
    setDrawerModel(false);
    setVisible(false);
  };
  const disabledDate = current => {
    return current > moment();
  };
  const saveUpdateFilter = () => {
    const { tags, programFromTime, programToTime, ...rest } = data;

    if (defaultFilterId) {
      dispatch(filterActions.updateFilter.request({ id: defaultFilterId, data: rest }));
    } else {
      dispatch(
        filterActions.addFilter.request({
          ...rest,
          userId: userId,
        })
      );
    }
    setMyChannels(true);
  };

  const getValue = () => {
    const values = data.escalation.map((i, index) => getAscalations().find(o => o.id === i)?.value);
    return values;
  };

  return (
    <div>
      <Drawer
        className="search-drawer"
        placement={placement}
        width={500}
        closable={false}
        onClose={onClose}
        maskClosable={true}
        visible={drawerModel}
      >
        <Form>
          <Row className="heading_row">
            <Col className="filter_heading" span={12}>
              Filters
            </Col>
            <Col span={12} className="header-btn align_center" style={{ alignItems: 'baseline' }}>
              <Button
                className="clear_text"
                onClick={() => clearData()}
                style={{ marginRight: '0px', border: 'none', paddingRight: '1px' }}
              >
                Clear All
              </Button>
              <button style={{ backgroundColor: 'transparent', border: 'none' }}>
                <DeleteOutlined style={{ color: '#FFFFFF' }} />
              </button>
            </Col>
          </Row>
          <br />

          <Row>
            {data?.source?.map((state, index) => {
              return (
                <Tag
                  closable
                  visible={state && true}
                  onClose={() => handleData({ type: 'source', value: state })}
                  className="tags-style"
                >
                  {state === 'Online' ? state + ' Vodeos' : state === 'Tv' ? 'TV' : state}
                </Tag>
              );
            })}
            {data.channel && data.channel.length === dbchannels.length ? (
              <Tag
                closable
                visible={data.channel.length === dbchannels.length && true}
                className="tags-style"
                onClose={() => {
                  setData({ ...data, channel: [] }), setMyChannels(false);
                }}
              >
                {'All Channels'}
              </Tag>
            ) : (
              data.channel?.map((channell, index) => {
                return (
                  <Tag
                    key={index}
                    closable
                    visible={channell && true}
                    onClose={() => handleData({ type: 'channel', value: channell })}
                    className="tags-style"
                  >
                    {channell}
                  </Tag>
                );
              })
            )}
            {
              <Tag visible={data.start_date && true} className="tags-style">
                {data.start_date}
              </Tag>
            }
            {
              <Tag visible={data.end_date && true} className="tags-style">
                {data.end_date}
              </Tag>
            }

            {data.hosts?.map((host, index) => {
              return (
                <Tag
                  closable
                  visible={host && true}
                  onClose={() => handleData({ type: 'hosts', value: host })}
                  className="tags-style"
                >
                  {host}
                </Tag>
              );
            })}
            {data.guests?.map((guest, index) => {
              return (
                <Tag
                  closable
                  visible={guest && true}
                  onClose={() => handleData({ type: 'guests', value: guest })}
                  className="tags-style"
                >
                  {guest}
                </Tag>
              );
            })}
            {data.programType?.map((program, index) => {
              return (
                <Tag
                  closable
                  visible={program && true}
                  onClose={() => handleData({ type: 'programType', value: program })}
                  className="tags-style"
                >
                  {program}
                </Tag>
              );
            })}
            {data.association?.map((assocate, index) => {
              return (
                <Tag
                  closable
                  visible={assocate && true}
                  onClose={() => handleData({ type: 'association', value: assocate })}
                  className="tags-style"
                >
                  {assocate}
                </Tag>
              );
            })}
            {data.escalation?.map((escaltion, index) => {
              return (
                <Tag
                  closable
                  visible={escaltion && true}
                  onClose={() => handleData({ type: 'escalation', value: escaltion })}
                  className="tags-style"
                >
                  {getAscalations().find(o => o.id === escaltion).value}
                </Tag>
              );
            })}
          </Row>
          <br />

          <Row className="content_heading">Content Sources</Row>
          <br />

          <Row className="d-flex-justify-between" style={{rowGap:"10px"}}>
            {Content.map((cont, index) => {
              return (
                <>
                  {contentSource !== '' && cont.name.startsWith(contentSource) ? (
                    <Col
                      span={cont.name === 'All' ? '2' : '4'}
                      className="d-flex-justify-center"
                      key={index}
                    >
                      <Button
                        className={
                          cont.name.startsWith(contentSource)
                            ? 'btn-style-orng border-style '
                            : 'btn-style border-style btn-bg'
                        }
                        onClick={() => {
                          contentSource === '' || contentSource === null;
                          (contentSource === '' || contentSource === null) &&
                            setData(prev => ({ ...prev, appliedPreset: '', source: cont.name }));
                        }}
                      >
                        {cont.name}
                      </Button>
                    </Col>
                  ) : contentSource === '' ? (
                    <Col
                      key={index}
                      span={cont.name === 'All' ? '2' : '4'}
                      className="d-flex-justify-center"
                    >
                      <Button
                        className={
                          data?.source?.includes(cont.name) &&
                          cont.name === 'All' &&
                          data?.source?.length === Content.length
                            ? 'btn-style-orng border-style border-none'
                            : data?.source?.includes(cont.name) && cont.name !== 'All'
                            ? 'btn-style-orng border-style border-none'
                            : 'btn-style border-style'
                        }
                        onClick={() => {
                          cont.name === 'All'
                            ? setData({
                                ...data,
                                appliedPreset: '',
                                source:
                                  data?.source?.length === Content.length
                                    ? []
                                    : Content.map(content => content.name),
                              })
                            : handleData({ type: 'source', value: cont.name });
                        }}
                      >
                        {cont.name === 'Tv' ? 'TV' : cont.name}
                      </Button>
                    </Col>
                  ) : (
                    ''
                  )}
                </>
              );
            })}
          </Row>
          <br />
          <Row className="chanels_heading">Channel</Row>
          <br />
          <Row>
            <Col span={8}>
              <label className="chanel_label main">
                <input type="checkbox" onChange={handleChannels} />
                All channels
                <span className={myChannels ? 'geekmark test' : 'geekmark1'}></span>
              </label>
            </Col>
            {dbchannels?.map((channell, index) => {
              return (
                <Col span={8} key={index}>
                  <label class="chanel_label main" style={{ marginBottom: '25px' }}>
                    <input
                      type="checkbox"
                      value={channell.name}
                      onClick={() => handleData({ type: 'channel', value: channell.name })}
                    />
                    {channell.name}
                    <span
                      className={
                        data.channel?.includes(channell.name) ? 'geekmark test' : 'geekmark1'
                      }
                    ></span>
                  </label>
                </Col>
              );
            })}
          </Row>
          <br />
          <Row className="date_heading">Date</Row>

          <Row className="mt-10">
            <Col className="duration_heading" span={12}>
              From
            </Col>
            <Col className="duration_heading" span={12}>
              To
            </Col>
          </Row>

          <Row className="mt-10">
            <Col className="date_heading" span={12}>
              <DatePicker
                style={{ width: '95%', marginRight: '5px' }}
                getPopupContainer={trigger => trigger.parentNode}
                defaultValue={moment()}
                format={dateFormat}
                onChange={date => {
                  setData({ ...data, start_date: moment(date).format('MM/DD/YYYY') });
                }}
                direction="vertical"
              />
            </Col>
            <Col className="date_heading" span={12}>
              <DatePicker
                style={{ width: '100%', color: 'grey' }}
                getPopupContainer={trigger => trigger.parentNode}
                defaultValue={moment(d)}
                format={dateFormat}
                disabledDate={disabledDate}
                onChange={date => {
                  setData({ ...data, end_date: moment(date).format('MM/DD/YYYY') });
                  localStorage.setItem('start_date', moment(date).format('MM/DD/YYYY'));
                  localStorage.setItem('end_date', moment(date).format('MM/DD/YYYY'));
                }}
                direction="vertical"
              />
            </Col>
          </Row>

          <Row className="program_heading mt-5">Program Type</Row>
          <Row className="mt-10">
            {programArr.map((program, index) => {
              return (
                <Button
                  className={
                    data.programType?.includes(program.name)
                      ? ' programe-type-style-orng'
                      : 'programe-type-style'
                  }
                  onClick={() => {
                    handleData({ type: 'programType', value: program.name });
                  }}
                >
                  {program.name}
                </Button>
              );
            })}
          </Row>

          <Row className="mt-15">
            <Col className="sub_heading" span={12}>
              Host
            </Col>
            <Col className="sub_heading" span={12}>
              {' '}
              Guest
            </Col>
          </Row>
          <Row className="mt-15">
            <Col span={12}>
              {' '}
              <Select
                mode="multiple"
                showSearch
                allowClear
                SelectAll={SelectAll}
                showArrow={true}
                maxTagCount={1}
                placeholder="Select host"
                value={data.hosts}
                options={hosts?.map(({ name }) => ({ value: name, title: name }))}
                onChange={value => {
                  value.includes('All')
                    ? value.map(value => {
                        setData({ ...data, hosts: [value, ...hosts?.map(({ name }) => name)] });
                      })
                    : setData({ ...data, hosts: value });
                }}
                onDeselect={value => {
                  if (value === 'All') setData({ ...data, hosts: [] });
                }}
                style={{ width: '90%' }}
                getPopupContainer={trigger => trigger.parentNode}
              ></Select>
            </Col>
            <Col span={12}>
              {' '}
              <Select
                mode="multiple"
                showSearch
                allowClear
                SelectAll={SelectAll}
                showArrow={true}
                maxTagCount={1}
                placeholder="Select guest"
                value={data.guests}
                options={guests?.map(({ name }) => ({ value: name, title: name }))}
                getPopupContainer={trigger => trigger.parentNode}
                onChange={value => {
                  value.includes('All')
                    ? value.map(value => {
                        setData({ ...data, guests: [value, ...guests?.map(({ name }) => name)] });
                      })
                    : setData({ ...data, guests: value });
                }}
                onDeselect={value => {
                  if (value === 'All') setData({ ...data, guests: [] });
                }}
                onSearch={onSearch1}
                style={{ width: '90%' }}
              ></Select>
              ,
            </Col>
          </Row>
          <Row className="mt-15">
            <Col className="sub_heading" span={12}>
              Association
            </Col>
            <Col className="sub_heading" span={12}>
              {' '}
              Escalations
            </Col>
          </Row>
          <Row className="mt-10">
            <Col span={12}>
              {' '}
              <Select
                mode="multiple"
                showSearch
                allowClear
                SelectAll={SelectAll}
                showArrow={true}
                maxTagCount="responsive"
                placeholder="Select association"
                value={data.association}
                options={getAssociations()}
                onChange={value => {
                  value.includes('All')
                    ? value.map(value => {
                        setData({
                          ...data,
                          association: [value, ...getAssociations().map(({ value }) => value)],
                        });
                      })
                    : setData({ ...data, association: value });
                }}
                onDeselect={value => {
                  if (value === 'All') setData({ ...data, association: [] });
                }}
                style={{ width: '90%' }}
                getPopupContainer={trigger => trigger.parentNode}
              ></Select>
            </Col>
            <Col span={12}>
              {' '}
              <Select
                mode="multiple"
                showSearch
                allowClear
                showArrow={true}
                maxTagCount="responsive"
                placeholder="Select escalation"
                value={getValue()}
                options={getAscalations()}
                getPopupContainer={trigger => trigger.parentNode}
                onChange={value => {
                  value.includes('All')
                    ? value.map(value => {
                        let checkAll = getAscalations().map(value => value.id);

                        setData({
                          ...data,
                          escalation: checkAll,
                        });
                      })
                    : setData({
                        ...data,
                        escalation: value.map(i => getAscalations().find(o => o.value === i)?.id),
                      });
                }}
                onDeselect={value => {
                  if (value === 'All') setData({ ...data, escalation: [] });
                }}
                style={{ width: '90%' }}
              ></Select>
            </Col>
          </Row>

          <Row className="d-flex-justify-between mt-15">
            <Col span={6} className="d-flex-justify-center">
              <Button
                className="btn-style border-style"
                onClick={cancel}
                style={{ margin: '5px 5px 5px 0px', backgroundColor: '#455177', border: 'none' }}
              >
                CANCEL
              </Button>
            </Col>

            <Col span={8} className="d-flex-justify-center">
              <Button
                className={
                  defaultFilterId
                    ? 'btn-style-orng border-style bg-default-apply'
                    : 'btn-style-orng border-style bg-default-apply'
                }
                style={{ margin: '5px', color: '#EF233C', borderColor: '#EF233C' }}
              >
                SET AS DEFAULT
              </Button>
            </Col>
            <Col span={8} className="d-flex-justify-center">
              <Button
                className="btn-style border-style bg-default-apply "
                style={{ margin: '5px', color: '#EF233C', borderColor: '#EF233C' }}
                onClick={applyFilter}
              >
                APPLY FILTER
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default SearchDrawer;
