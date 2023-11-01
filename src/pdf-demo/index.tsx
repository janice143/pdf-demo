import { Button, message } from 'antd';
import { useState } from 'react';
import { PDF_PRINT_IDS } from './constants';
import PdfDemo1 from './pages/demo';
import { outputPDF } from './pdf-print';

const PdfDownload = () => {
  const [loading, setLoading] = useState(false);
  const filename = 'test test tes';

  const handleDownloadSupplier = () => {
    setLoading(true);
    htmlToPdf({
      contentId: PDF_PRINT_IDS.content,
      footerId: PDF_PRINT_IDS.footer,
      filename
      // orientation: 'landscape',
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
    <>
      <Button type="primary" onClick={handleDownloadSupplier} loading={loading}>
        导出pdf
      </Button>
      <PdfDemo1 />
    </>
  );
};

export default PdfDownload;
