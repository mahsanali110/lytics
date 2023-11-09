import React from 'react';
import { Collapse } from 'antd';
import './Collapse.scss';

const { Panel } = Collapse;

function LyticsCollapse({ panels, showArrow, collapsible, annimation, ...rest }) {
  return (
    <>
      <Collapse ghost accordion {...rest}>
        {panels.map(({ content, header, key }) => {
          return (
            <Panel
              collapsible={collapsible}
              style={{ marginBottom: '5px' }}
              showArrow={showArrow}
              header={header}
              key={key}
              className="animate__animated animate__slideInLeft"
            >
              {content}
            </Panel>
          );
        })}
      </Collapse>
    </>
  );
}

LyticsCollapse.defaultProps = {
  panels: [],
  showArrow: true,
  collapsible: '',
};

export default LyticsCollapse;
