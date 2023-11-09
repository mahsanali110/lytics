import { Layout } from 'antd';
import PropTypes from 'prop-types';

const { Content } = Layout;

const Minimal = props => {
  const { children } = props;

  return (
    <Layout>
      <Content>{children}</Content>
    </Layout>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
};

export default Minimal;
