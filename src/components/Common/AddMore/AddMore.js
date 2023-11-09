import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import './AddMore.scss';

const AddMore = ({ handleClick }) => (
  <div className="add-more-wrapper" onClick={handleClick}>
    <FontAwesomeIcon
      icon={faPlusCircle}
      size="lg"
      style={{ color: 'white', fontSize: 'medium' }}
    />
    <span className="text small-font-size">Add</span>
  </div>
);

AddMore.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

AddMore.defaultProps = {
  handleClick: () => console.log('clicked'),
};

export default AddMore;
