import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
const { Panel } = Collapse;

import './SocialAccordionWrapper.scss';

function SocailAccordionWrapper({ panels, ...rest }) {
  return (
    <Collapse
      defaultActiveKey={['0']}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          style={{ color: 'white', fontSize: '18px', left: '430px' }}
          rotate={isActive ? 90 : 0}
        />
      )}
      expandIconPosition="end"
      {...rest}
    >
      {panels.map((panel, index) => (
        <Panel header={panel.heading} key={index}>
          {panel.content}
        </Panel>
      ))}
    </Collapse>
  );
}

export default SocailAccordionWrapper;
