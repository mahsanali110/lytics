import { Typography, Space } from 'antd';
const { Title, Paragraph } = Typography;

const HelpArticleDetails = ({ selectedSection }) => (
    <Space direction="vertical" className="detail-section">
      <div>
        <Title level={4}>{selectedSection}</Title >
        <Paragraph>
          Sit do qui ullamco est est nisi tempor deserunt. Adipisicing exercitation labore voluptate
          in labore. Voluptate veniam veniam sunt laboris. Ad amet eiusmod ad ea exercitation
          exercitation. Enim quis dolore cillum consectetur Lorem quis ex occaecat exercitation
          pariatur qui.
        </Paragraph>
      </div>
      <div>
      <Title level={5}>Sub Heading</Title>
        <ul>
          <li>Step number one</li>
          <li>Step number two</li>
          <li>Step number three</li>
          <li>Step number four</li>
        </ul>
      </div>
      <div>
      <Title level={5}>Sub Heading</Title>
        <Paragraph>
          Dolore labore enim labore dolore ad est consectetur. Dolore eu Lorem incididunt Lorem aute
          officia sit duis esse fugiat enim id laborum. Nulla sunt duis officia ipsum reprehenderit.
          Elit veniam sunt adipisicing nostrud laborum nisi amet. In et enim incididunt est sint id.
          Velit quis amet eiusmod amet cupidatat commodo eu reprehenderit anim Lorem tempor minim.
        </Paragraph>
        <Paragraph>
          Mollit exercitation ut aliqua nulla irure ullamco non laboris deserunt ex aute. Sint
          cupidatat aute occaecat deserunt. Tempor ex magna laboris amet. Officia mollit non
          incididunt fugiat eu voluptate proident Lorem excepteur ullamco reprehenderit deserunt sit
          velit. Tempor sit aliquip proident et qui sint aliqua do quis sit nisi duis nostrud
          proident. Eu incididunt minim irure exercitation laborum et dolor.
        </Paragraph>
      </div>
    </Space>
  );

export default HelpArticleDetails;