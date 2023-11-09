import propTypes from 'prop-types';
import './Hashtag.scss';
import { HashTag } from 'components/Common';

const Hashtags = ({ hashtags }) => {
  return (
    <div className="hashtag-wrapper">
      <h3 className="hashtag-header">Hashtags</h3>
      <div className="hashtag-container">
        {hashtags.map(hashtag => {
          return <HashTag hashtag={hashtag} editable={false} />;
        })}
      </div>
    </div>
  );
};

Hashtags.propTypes = {
  hashtags: propTypes.array,
};

export default Hashtags;
