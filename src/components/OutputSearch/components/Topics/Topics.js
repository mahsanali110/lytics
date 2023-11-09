import PropTypes from 'prop-types';
import './Topics.scss';

const Topics = ({ topics }) => {
  return (
    <div className="topics-wrapper">
      <h3 className="topic-header">Topics</h3>
      <div className="topics-container">
        <h4>
          <span className="orange-text">Topic 1:</span> {topics?.topic1}
        </h4>
        <h4>
          <span className="orange-text">Topic 2:</span> {topics?.topic2.join(', ')}
        </h4>
        <h4>
          <span className="orange-text">Topic 3:</span> {topics?.topic3.join(', ')}
        </h4>
      </div>
    </div>
  );
};

Topics.PropTypes = {
  topics: PropTypes.array,
};

export default Topics;
