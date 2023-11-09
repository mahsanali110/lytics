import PropTypes from 'prop-types';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

import './Tabs.scss';

const IMSTabs = ({ tabPanes, ...rest }) => (
  <div className="editor_card-container">
    <Tabs {...rest}>
      {tabPanes.map(({ title, content, disabled }, i) => (
        <TabPane tab={title} key={i} disabled={disabled}>
          {content}
        </TabPane>
      ))}
    </Tabs>
  </div>
);

IMSTabs.propTypes = {
  tabPanes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any,
      content: PropTypes.node,
    })
  ),
};

IMSTabs.defaultProps = {
  tabPanes: [],
};

export default IMSTabs;
