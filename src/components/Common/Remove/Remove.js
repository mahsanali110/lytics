import PropTypes from 'prop-types';


import './Remove.scss';

const Remove = ({ handleClick }) => (
  <div className="remove-wrapper">
    <span className="text small-font-size text-grey" onClick={handleClick}>Remove</span>
  </div>
);

Remove.propTypes = {
  handleClick: PropTypes.func.isRequired,
};

Remove.defaultProps = {
  handleClick: () => console.log('clicked'),
};

export default Remove;
