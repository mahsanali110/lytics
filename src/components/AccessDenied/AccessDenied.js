import { Typography } from 'antd';

import './AccessDenied.scss';

const { Text } = Typography;

const AccessDenied = () => (
  <div className="access-denied-wrapper">
    <div className="access-denied-body">
      <div className="access-denied-heading-wrapper">
        <Text className="text-white access-denied-heading">403</Text>
        <Text className="text-grey">Access Denied!</Text>
      </div>

      <Text className="text-pink access-denied-detail medium-font-size">
        Please contact with admin.
      </Text>
    </div>
  </div>
);

export default AccessDenied;
