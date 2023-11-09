import { Tabs } from 'antd';
import { memo } from 'react';

const CustomTabs = ({ tabItems, tabHeader, activeTab, defautTab }) => {
  const { TabPane } = Tabs;

  return (
    <div style={{ height: '100%' }}>
      <div>{tabHeader}</div>
      <Tabs
        activeKey={activeTab}
        defaultActiveKey={defautTab}
        style={{ color: 'white' }}
        tabPosition={'top'}
        tabBarStyle={{ display: 'none' }}
        type="editable"
        tabBarGutter={0}
        destroyInactiveTabPane={true}
      >
        {tabItems.reverse().map(({ key, children }) => (
          <TabPane tab={key} key={key}>
            {children}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};
export default memo(CustomTabs);
