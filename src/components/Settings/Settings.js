import React, { useState } from 'react';
import { Layout } from 'antd';
import { Row, Col, Input } from 'antd';
import { Button, SearchField } from 'components/Common';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import settingsActions from 'modules/settings/actions';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AddUser,
  AddProgramType,
  AddProgramName,
  AddHost,
  AddGuest,
  AddChannel,
  AddAssociation,
  AddTheme,
  AddAlarm,
  AddCompany,
  AddGroup,
  AddWriter,
} from 'components/AdminPanel';

import './Settings.scss';
import {
  DesktopOutlined,
  FundProjectionScreenOutlined,
  UsergroupDeleteOutlined,
  FileOutlined,
  UserOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import channelsActions from 'modules/channels/actions';
import associationsActions from 'modules/associations/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import usersActions from 'modules/users/actions';

const { Header, Content, Sider } = Layout;
const style = {
  backgroundColor: '#131C3A',
  padding: '40px',
  borderRadius: '10px',
};
const addThemeStyle = {
  backgroundColor: '#3E404B',
  padding: '40px',
  borderRadius: '10px',
  height: '320px',
  overflow: 'scroll',
};
const tmp = '/settings';
const menuComponents = [
  `${tmp}/user`,
  `${tmp}/channels`,
  `${tmp}/program-type`,
  `${tmp}/hosts`,
  `${tmp}/program-name`,
  `${tmp}/association`,
  `${tmp}/guests`,
  `${tmp}/theme`,
  `${tmp}/alarms`,
];
export default function Settings(props) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { showForm, formType } = useSelector(state => state.settingsReducer);
  const [collapsed, setCollasped] = useState(false);

  let { url } = useRouteMatch();

  const onCollapse = collapsed => {
    setCollasped(collapsed);
  };
  const urlRoutes = [
    '/settings/user',
    '/settings/channels',
    '/settings/program-type',
    '/settings/hosts',
    '/settings/writers',
    '/settings/program-name',
    '/settings/association',
    '/settings/association',
    '/settings/guests',
    '/settings/theme',
    '/settings/alarms',
  ];
  const submit = () => {};
  let history = useHistory();
  const check = e => {
    dispatch(settingsActions.setFormVisibility({ showForm: false }));
    e === 0 && history.push('/settings/user');
    e === 1 && history.push('/settings/channels');
    e === 2 && history.push('/settings/program-type');
    e === 3 && history.push('/settings/hosts');
    e === 4 && history.push('/settings/program-name');
    e === 5 && history.push('/settings/association');
    e === 6 && history.push('/settings/guests');
    e === 7 && history.push('/settings/theme');
    e === 8 && history.push('/settings/alarms');
  };
  const handleAddNew = () => {
    if (formType === 'ADD') {
      dispatch(settingsActions.setFormVisibility({ showForm: !showForm }));
      dispatch(channelsActions.resetFormDetails());
      dispatch(associationsActions.resetFormDetails());
      dispatch(guestsActions.resetFormDetails());
      dispatch(hostsActions.resetFormDetails());
      dispatch(usersActions.resetFormDetails());
    } else dispatch(settingsActions.setFormVisibility({ formType: 'ADD' }));
    if (formType === 'ADD') {
      dispatch(settingsActions.setFormVisibility({ showForm: !showForm }));
      dispatch(channelsActions.resetFormDetails());
    } else dispatch(settingsActions.setFormVisibility({ formType: 'ADD' }));
  };
  const handleSearch = () => {
    urlRoutes.filter(route => {
      route === url && dispatch({ type: 'SEARCH_SETTINGS', payload: searchText });
    });
  };

  const handleOnChange = e => {
    setSearchText(e.target.value);
    urlRoutes.filter(route => {
      route === url && dispatch({ type: 'SEARCH_SETTINGS', payload: searchText });
    });
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'black' }}>
      <Layout className="site-layout">
        {!props?.hideHeader && (
          <Header className="site-layout-header">
            <Row justify="center" className="site-layout-row">
              <Col span={2} style={{ marginLeft: '-20px' }}></Col>
              <Col span={20}>
                <Row justify="start">
                  <Col className="site-layout-col-1">
                    <Button
                      style={{ marginTop: '18px' }}
                      variant="secondary"
                      type="big"
                      onClick={handleAddNew}
                    >
                      {/* <PlusOutlined /> NEW */}
                      <FontAwesomeIcon className="icon" icon={faPlus} size="sm" />
                      &nbsp;&nbsp;NEW
                    </Button>
                  </Col>
                  <Col className="site-layout-col-searchbar" style={{ width: '74%', flexGrow: 1 }}>
                    <SearchField
                      className="Search-field"
                      placeholder="Search"
                      onChange={handleOnChange}
                      onPressEnter={handleSearch}
                      maxlength="64"
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={2}></Col>
            </Row>
          </Header>
        )}
        <Content className="site-content">
          {url === '/settings/program-name' && (
            <>
              <Row className="component-format">
                <Col span={2} />
                <Col span={20} style={showForm && style}>
                  {showForm && <AddProgramName />}
                </Col>
                <Col span={1} />
              </Row>
            </>
          )}
          {url === '/settings/association' && (
            <>
              <Row className="component-format">
                <Col span={2} />
                <Col span={20} style={showForm && style}>
                  {showForm && <AddAssociation />}
                </Col>
                <Col span={1}></Col>
              </Row>
            </>
          )}
          {url === '/settings/guests' && (
            <>
              <Row className="component-format">
                <Col span={2} />
                <Col span={20} style={showForm && style}>
                  {showForm && <AddGuest />}
                </Col>
                <Col span={1}></Col>
              </Row>
            </>
          )}
          {url === '/settings/program-type' && (
            <>
              <Row className="component-format">
                <Col span={2} />
                <Col span={20} style={showForm && style}>
                  {showForm && <AddProgramType />}
                </Col>
                <Col span={1}></Col>
              </Row>
            </>
          )}
          {url === '/settings/channels' && (
            <Row className="component-format">
              <Col span={2} />
              <Col span={20} style={showForm && style}>
                {' '}
                {showForm && <AddChannel />}
              </Col>
              <Col span={1}></Col>
            </Row>
          )}
          {url === '/settings/hosts' && (
            <Row className="component-format">
              <Col span={2} />
              <Col span={20} style={showForm && style}>
                {showForm && <AddHost />}
              </Col>
              <Col span={1}></Col>
            </Row>
          )}
          {url === '/settings/writers' && (
            <Row className="component-format">
              <Col span={2} />
              <Col span={20} style={showForm && style}>
                {showForm && <AddWriter />}
              </Col>
              <Col span={1}></Col>
            </Row>
          )}
          {url === '/settings/user' && (
            <Row className="component-format">
              <Col span={2} />
              <Col span={20} style={showForm && style}>
                {' '}
                {showForm && <AddUser />}
              </Col>
              <Col span={1}></Col>
            </Row>
          )}
          {url === '/settings/theme' && (
            <Row className="component-format">
              <Col span={2} />
              <Col span={20} style={showForm && style}>
                {showForm && <AddTheme />}
              </Col>
              <Col span={1}></Col>
            </Row>
          )}
          {url === '/settings/alarms' && (
            <Row className="component-format">
              <Col span={2} />
              <Col span={20} style={showForm && style}>
                {showForm && <AddAlarm />}
              </Col>
              <Col span={1}></Col>
            </Row>
          )}
          {url === '/settings/company' && (
            <>
              <Row className="component-format">
                <Col span={2} />
                <Col span={20} style={showForm && style}>
                  {showForm && <AddCompany />}
                </Col>
                <Col span={1}></Col>
              </Row>
            </>
          )}
          {url === '/settings/group' && (
            <>
              <Row className="component-format">
                <Col span={2} />
                <Col span={20} style={showForm && style}>
                  {showForm && <AddGroup />}
                </Col>
                <Col span={1}></Col>
              </Row>
            </>
          )}
          {props && props.newTable && <div>{props.newTable()}</div>}
        </Content>
      </Layout>
    </Layout>
  );
}
