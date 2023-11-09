import moment from 'moment';

import { getStatusColor, getPriorityColor, pascalCase, formatDate } from 'modules/common/utils';
import { Image } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button } from 'components/Common';

import { CalendarIcon, ClockIcon } from 'assets/icons';
const redirectToJobsDeails = id => {
  const uri = getJobsDetailUri(user.role);
  if (!uri) return;
  // window.location.href = `/#${uri}/${id}`;
  history.push(`${uri}/${id}`);
  // location.reload();
};

const handleTableRowClick = (index, record) => {
  dispatch(navActions.updateLink({ type: 'job', index }));
  redirectToJobsDeails(record.id);
};
export const columns = [
  {
    title: 'Clip Title',
    dataIndex: 'programName',
    sorter: true,
    sorter: (a, b) => a.programName.localeCompare(b.programName),
    render: (text, record) => {
      return (
        <div style={{ textOverflow: 'ellipsis' }}>
          <span> hy </span>
        </div>
      );
    },
  },
  {
    title: 'Status',
    dataIndex: 'jobState',
    sorter: (a, b) => a.jobState.localeCompare(b.jobState),
    sortDirections: ['descend'],
    render: (text, record) => {
      return (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          <span className={`${getStatusColor(text)}`}> {text} </span>
        </div>
      );
    },
  },
  {
    title: 'QC',
    dataIndex: 'jobState',
    render: (text, record) => {
      return (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          <Button
            variant="secondary"
            onClick={() => {
              handleTableRowClick(record.id);
            }}
          >
            QC
          </Button>
        </div>
      );
    },
  },
];
