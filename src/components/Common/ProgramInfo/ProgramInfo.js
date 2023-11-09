import PropTypes from 'prop-types';
import { Typography, Row, Image } from 'antd';
import { Card } from 'components/Common';
import './ProgramInfo.scss';
import { formatDate, formateTime } from 'modules/common/utils';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import moment from 'moment';
const { Text } = Typography;
import { uploadPath } from 'constants/index';

const ProgramInfo = ({
  programInfo: { programName, programDate, programTime, clippedBy, channelLogoPath },
}) => (
  <>
    <div className="qc-wrapper">
      <div>
        {/* <img src={channelLogoPath} width="33" height="38" /> */}
        <Image
          src={`${USERS_BASE_URL}/${uploadPath}/${channelLogoPath}`}
          width={50}
          height={50}
          fallback="placeholder.png"
          preview={false}
        />
      </div>
      <div className="program-info-label-wrapper">
        {/* <div className="program-info-data"> */}
        <div className="left-program-info">
          <div className="label">
            <Text className="text-primary">{'Progarm Name: ' + programName}</Text>
          </div>
          <div className="label">
            <Text className="text-secondary">{'Clipped By: ' + clippedBy}</Text>
          </div>
        </div>
        <div className="right-program-info">
          <div className="label">
            <Text className="text-primary">{moment(programDate).format('DD/MM/YYYY')}</Text>
          </div>
          <div className="label">
            <Text className="text-primary">{programTime}</Text>
          </div>
          {/* </div> */}
        </div>
        {/* <div className="prgram-info-data">
          <div className="label">
            <Text className="text-primary small-font-size">
              {formatDate(programDate, 'DD/MM/YYYY')}
            </Text>
          </div>
          <div className="label">
            <Text className="text-primary small-font-size">{formateTime(programTime)}</Text>
          </div>
        </div> */}
      </div>
    </div>
  </>
);
ProgramInfo.prototype = {
  programInfo: PropTypes.object,
};
export default ProgramInfo;
