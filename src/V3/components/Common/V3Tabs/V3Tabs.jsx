import PropTypes from 'prop-types';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

import './V3Tabs.scss';

const V3Tabs = ({ tabPanes, varient, ...rest }) => (
  <div className="V3Tabs">
    <Tabs className={`${varient}`} {...rest}>
      {tabPanes.map(({ title, content }, i) => (
        <TabPane tab={title} key={i}>
          {content}
        </TabPane>
      ))}
    </Tabs>
  </div>
);

V3Tabs.propTypes = {
  tabPanes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any,
      content: PropTypes.node,
    })
  ),
  varient: PropTypes.oneOf(['primary', 'secondary']),
};

V3Tabs.defaultProps = {
  tabPanes: [],
  varient: 'primary',
};

export default V3Tabs;
