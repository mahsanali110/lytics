import PropTypes from 'prop-types';

import './CardDetail.scss';

const CardDetail = ({ children, type, variant, ...rest }) => (
  <section className={`card-detail-${variant} ${type}`} {...rest}>
    {children}
  </section>
);

CardDetail.propTypes = {
  type: PropTypes.oneOf(['invert']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

CardDetail.defaultProps = {
    variant: 'primary'
}

export default CardDetail;
