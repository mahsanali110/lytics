import PropTypes from 'prop-types';
import { Tag } from 'antd';

import './Tag.scss';

const IMSTag = ({ text, variant, icon: TagIcon, ...rest }) => {
  
  return (
    <Tag className={`tag-${variant}`} icon={TagIcon && <TagIcon />} {...rest}>
      {text}
    </Tag>
  );
};

IMSTag.propTypes = {
  text: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'positive', 'negative', 'balanced', 'escalate']),
  icon: PropTypes.node,
};

IMSTag.defaultProps = {
  variant: 'default',
};

export default IMSTag;
