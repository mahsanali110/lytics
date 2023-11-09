import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Image, Popconfirm, Form, Typography } from 'antd';
import moment from 'moment';
import { jobActions } from 'modules/jobs/actions';
import { getPriorityColor, pascalCase, formatDate, formateTime } from 'modules/common/utils';
import { CalendarIcon, ClockIcon, EditIcon } from 'assets/icons';
import { Table } from 'components/Common';
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className="table-edit-inputField"
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ data, onChange }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');

  const isEditing = record => record.id === editingKey;

  const edit = record => {
    form.setFieldsValue({
      webMentions: record.impact.webMentions,
      onlineViews: record.impact.onlineViews,
      tvRatings: record.impact.tvRatings,
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async id => {
    try {
      const row = await form.validateFields();
      dispatch(jobActions.updateJob.request({ data: { impact: row }, id }));
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      sorter: true,
      sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
            <div style={{ marginBottom: '5px' }}>
              <span className="table-icon-wrapper">
                <CalendarIcon />
              </span>{' '}
              <span className="text-white">{formatDate(record.programDate, 'DD MMMM YYYY')}</span>
            </div>
            <div>
              <span className="table-icon-wrapper">
                <ClockIcon />
              </span>{' '}
              {formateTime(record.programTime)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      sorter: (a, b) => a.channel.length - b.channel.length,
      sortDirections: ['descend'],
      render: (text, record) => {
        return (
          <figure>
            <Image
              width={25}
              src={record.channelLogoPath}
              preview={false}
              fallback="placeholder.png"
            />
            <figcaption>{text}</figcaption>
          </figure>
        );
      },
    },
    {
      title: 'Program Title',
      dataIndex: 'programName',
      sorter: false,
    },

    {
      title: 'Online View',
      dataIndex: 'onlineViews',
      editable: true,
      sorter: (a, b) => a.impact.onlineViews.localeCompare(b.impact.onlineViews),
      sortDirections: ['descend'],
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span className={`bg-black priority-tag ${getPriorityColor(pascalCase(text))}`}>
              {' '}
              {pascalCase(record.impact.onlineViews)}{' '}
            </span>
          </div>
        );
      },
    },
    {
      title: 'TV Rating',
      dataIndex: 'tvRatings',
      editable: true,
      sorter: (a, b) => a.impact.tvRatings.localeCompare(b.impact.tvRatings),
      sortDirections: ['descend'],
      render: (text, record) => {
        return <div>{pascalCase(record.impact.tvRatings)} </div>;
      },
    },
    {
      title: 'Web Monitoring',
      dataIndex: 'webMentions',
      editable: true,
      sorter: (a, b) => a.impact.webMentions.localeCompare(b.impact.webMentions),
      sortDirections: ['descend'],
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span className={`bg-black priority-tag ${getPriorityColor(pascalCase(text))}`}>
              {' '}
              {pascalCase(record.impact.webMentions)}{' '}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id, record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <EditIcon disabled={editingKey !== ''} onClick={() => edit(record)} />
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        handleTableChange={onChange}
      />
    </Form>
  );
};

export default EditableTable;
