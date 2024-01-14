import { Button, Row, Tabs, TabsProps, message } from 'antd';
import { useState } from 'react';
import { PDF_PRINT_IDS } from './constants';
import { PdfDemo1, PdfDemo2, PdfDemo3, PdfDemo4, PdfDemo5 } from './pages/demo';
import { outputPDF } from './pdf-print';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '单页',
    children: <PdfDemo1 />
  },
  {
    key: '2',
    label: '多页',
    children: <PdfDemo2 />
  },
  {
    key: '3',
    label: '多页分页截断',
    children: <PdfDemo3 />
  },
  {
    key: '4',
    label: '自定义页眉页脚',
    children: <PdfDemo4 />
  },
  {
    key: '5',
    label: '横向',
    children: <PdfDemo5 />
  }
];

const PdfDownload = () => {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('1');
  const filename = 'test test tes';

  const handleChange = (key) => {
    setTab(key);
  };

  const handleDownload = () => {
    setLoading(true);
    htmlToPdf({
      contentId: PDF_PRINT_IDS[`content${tab}`],
      headerId: tab === '4' ? PDF_PRINT_IDS.header : '',
      footerId: tab === '4' ? PDF_PRINT_IDS.footer : '',
      filename,
      orientation: tab === '5' ? 'landscape' : 'portrait'
    });
  };

  const htmlToPdf = async ({
    contentId,
    headerId = '',
    footerId = '',
    filename,
    orientation = 'portrait' as 'portrait' | 'landscape'
  }) => {
    const element: any = document.getElementById(contentId);
    const header: any = document.getElementById(headerId);
    const footer: any = document.getElementById(footerId);
    console.log(tab, orientation, element);

    try {
      await outputPDF({
        element,
        footer,
        header,
        filename,
        orientation
      });
    } catch (error) {
      const base = '导出失败';
      message.error(
        typeof error === 'string'
          ? `${base}，${error}`
          : `${base}，${JSON.stringify(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify={'center'} style={{ flexDirection: 'column', margin: 20 }}>
      <div style={{ margin: '10px auto' }}>
        <Button type="primary" onClick={handleDownload} loading={loading}>
          导出pdf
        </Button>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={handleChange} />
    </Row>
  );
};

export default PdfDownload;
