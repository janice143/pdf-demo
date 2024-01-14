import { Space, Table, Tag } from 'antd';
import { PDF_PRINT_IDS } from '../constants';
import './index.css';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'index',
    key: 'index',
    render: (_, __, index) => index as any
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    )
  }
];

const data: DataType[] = [
  {
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];

// 单页
const PdfDemo1 = () => {
  return (
    <div className="demo1-container">
      <div id={PDF_PRINT_IDS.content1}>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

// 多页
const PdfDemo2 = () => {
  return (
    <div className="demo1-container">
      <div id={PDF_PRINT_IDS.content2}>
        <div className="border" style={{ height: 5000 }}></div>
      </div>
    </div>
  );
};

// 多页分页截断
const PdfDemo3 = () => {
  const data1 = new Array(10).fill(data).flat();
  return (
    <div className="demo1-container">
      <div id={PDF_PRINT_IDS.content3}>
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
      </div>
    </div>
  );
};

// 自定义页面也叫
const PdfDemo4 = () => {
  const data1 = new Array(10).fill(data).flat();
  return (
    <div className="demo1-container">
      <div id={PDF_PRINT_IDS.header}>我是页眉</div>
      <div id={PDF_PRINT_IDS.content4}>
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
      </div>
      <div id={PDF_PRINT_IDS.footer}>我是页脚</div>
    </div>
  );
};

// 横向
const PdfDemo5 = () => {
  const data1 = new Array(10).fill(data).flat();
  return (
    <div className="demo1-container">
      <div id={PDF_PRINT_IDS.content5}>
        <div>横向横向横向</div>
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
        <Table columns={columns} dataSource={data1} pagination={false} />
      </div>
    </div>
  );
};

export { PdfDemo1, PdfDemo2, PdfDemo3, PdfDemo4, PdfDemo5 };
