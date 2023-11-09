import { useState } from 'react';
import { ProfileOutlined, ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { Dropdown, Typography, Space, List } from 'antd';
import { InformationIcon } from 'assets/icons';
import { SearchField } from 'components/Common';

import HelpArticleDetails from './HelpArticleDetails';

const { Text } = Typography;
import './InformationMenu.scss';

const InformationMenu = () => {
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');

  const toggleInfoDropdown = () => {
    setShowInfoDropdown(!showInfoDropdown);
    setSelectedSection('');
  };

  const sections = ['Training Book', 'Software Manual', 'Shortcut Sheets', 'Support Document'];

  const InformationMenu = (
    <div className="info-dropdown">
      <Space direction="vertical">
        <div className="info-dd-header">
          {selectedSection && (
            <span className="back-btn">
              <Space>
                <ArrowLeftOutlined className="icon" onClick={() => setSelectedSection('')} />{' '}
                {'Help'}
              </Space>
            </span>
          )}
          <h3 className={`${selectedSection && 'opacity-0'} text-white`} style={{ flex: 1 }}>
            Help
          </h3>
          <div />
          <span className="close-dd">
            <CloseOutlined onClick={() => setShowInfoDropdown(false)} />
          </span>
        </div>
        <SearchField size="small" placeholder="Search Help" />

        {!selectedSection ? (
          <>
            <Text className="text-white" style={{ marginLeft: '15px', marginBottom: 0 }}>
              Help resources
            </Text>
            <List
              split={false}
              size="small"
              dataSource={sections}
              renderItem={item => (
                <List.Item
                  className="list-item"
                  onClick={e => setSelectedSection(e.target.innerText)}
                >
                  <Space size="middle">
                    <ProfileOutlined className="list-icon" />
                    {item}
                  </Space>
                </List.Item>
              )}
            />
          </>
        ) : (
          <HelpArticleDetails selectedSection={selectedSection} />
        )}
      </Space>
    </div>
  );

  return (
    <Dropdown overlay={InformationMenu} trigger={['click']} visible={showInfoDropdown}>
      <div className="info-icon-wrapper" onClick={toggleInfoDropdown}>
        <InformationIcon />
      </div>
    </Dropdown>
  );
};
export default InformationMenu;
