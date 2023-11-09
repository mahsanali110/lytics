import propTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';

import './HashTag.scss';

const HashTag = ({ hashtag, handleDelete, index, editable }) => {
  return typeof hashtag === 'object' ? (
    hashtag.originalTag.map(tags => {
      return (
        <span className="hash-tag">
          {tags}
          {editable && (
            <i onClick={() => handleDelete(index)} className="icon">
              <CloseOutlined />
            </i>
          )}
        </span>
      );
    })
  ) : (
    <span className="hash-tag">
      {hashtag}
      {editable && (
        <i onClick={() => handleDelete(index)} className="icon">
          <CloseOutlined />
        </i>
      )}
    </span>
  );
};

HashTag.defaultProps = {
  handleDelete: () => {},
  hashtag: '',
  editable: true,
};

export default HashTag;
