import { PDF_PRINT_IDS } from '../constants';
import './index.css';

const PdfDemo1 = () => {
  return (
    <div className="demo1-container">
      test test test
      <div id={PDF_PRINT_IDS.content}>
        <div className="border" style={{ height: 200 }}>
          11
        </div>
      </div>
    </div>
  );
};

export default PdfDemo1;
