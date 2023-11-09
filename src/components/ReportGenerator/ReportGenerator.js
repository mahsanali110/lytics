import React, { useRef, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Row, Col } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';

import './ReportGenerator.scss';

import { Button } from 'components/Common';
import { ChannelAnalyticsGraph, ChannelAnalyticsPDF, PdfButtonHandler } from './components';
import { convertImageToUrl, getTokens } from 'modules/common/utils';
import { func } from 'prop-types';
import { USERS_BASE_URL } from 'constants/config/config.dev';

function ReportGenerator() {
  const graphRef = useRef(null);
  const pdfRef = useRef(null);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    filtered: true,
  });
  const [loading, setLoading] = useState(false);

  function JsxforPdf({ imageSrc }) {
    return (
      <>
        <h1 style={{ textAlign: 'center', fontSize: '25px' }}>
          Category Analysis By Channel (Top 10)
        </h1>
        <img
          src={imageSrc}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </>
    );
  }

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${USERS_BASE_URL}/analytics/categoryAnalysis`,
        {
          ...filter,
        },

        { headers: { Authorization: `Bearer ${getTokens().access.token}` } }
      );
      data.forEach(el => {
        if (el && Object.hasOwnProperty.call(el, 'Blog')) {
          el.Web = el.Blog;
        }
      });
      setData(data);
      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, 2000)
      );

      const imageData = await convertImageToUrl(graphRef.current?.container);
      const jsx = ReactDOMServer.renderToString(<JsxforPdf imageSrc={imageData} />);
      const opt = {
        margin: 1,
        filename: 'Report - ' + moment().format('DD-MM-YYYY'),
        image: { type: 'jpeg', quality: 2 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().from(jsx).set(opt).save();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Row justify="end">
        <Col>
          <Button loading={loading} ref={pdfRef} onClick={downloadPDF}>
            DOWNLOAD PDF
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: '-5500px', zIndex: '-100' }}>
        <Col span={24}>
          {/* <h1>nothing</h1> */}
          <ChannelAnalyticsGraph graphRef={graphRef} data={data} />
        </Col>
      </Row>
    </>
  );
}

export default ReportGenerator;
