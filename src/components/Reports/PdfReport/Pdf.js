import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import moment from 'moment';
export const handleGeneratePdf = (fromDate, toDate) => {
  const { logo } = window['config'];
  const pdf = new jsPDF('p', 'mm', 'a4');
  let pageHeight = 297;
  let pageWidth = 210;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.text(115, 23, 'Talk Show Report', 'center');
  pdf.setFontSize(9);
  pdf.text(115, 30, `Generated At: ${moment().format('L')}`, 'center');
  pdf.line(200, 39, 10, 39);
  pdf.setFontSize(12);
  pdf.text(10, 45, 'Report from: ');
  pdf.setTextColor(0, 0, 139);
  pdf.text(35, 45, `${moment(fromDate).format('LL')}`);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text(94, 45, 'to: ');
  pdf.setTextColor(0, 0, 139);
  pdf.setFontSize(12);
  pdf.text(100, 45, `${moment(toDate).format('LL')}`);
  pdf.setTextColor(0, 0, 0);
  pdf.addImage(logo, 'JPEG', 10, 15, 25, 17);
  pdf.setTextColor(0, 0, 0);
  pdf.text(100, 60, 'DAILY SIGNIFICANT TALK SHOWS (TRANSCRIPT)', 'center');
  pdf.line(151, 61, 50, 61);
  pdf.setLineWidth(1);

  pdf.autoTable({
    theme: 'grid',
    margin: { horizontal: 10, top: 10 },
    headStyles: {
      fillColor: [225, 225, 225],
      textColor: [70, 70, 70],
      fontSize: 10,
      padding: 0,
    },
    bodyStyles: { fillColor: [255, 255, 255], textColor: [70, 70, 70], fontSize: 9, padding: 0 },
    startY: 70,
    html: '#table',
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 28 },
      2: { cellWidth: 110 },
      3: { cellWidth: 44 },
    },
  });

  pdf.save('canvas.pdf');
};

const PDF = ({ report }) => {
  console.log('Reports =>', { report });
  return (
    <>
      <table id="table" style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Source</th>
            <th>Summary</th>
            <th>Program Trends</th>
          </tr>
        </thead>
        {report?.map((r, index) => (
          <tbody key={index}>
            <tr>
              <td>{index + 1}</td>
              <td>
                {r.channel}/{r.programName} <br></br>
                <br></br>
                {r.hosts.map((host, index) => (
                  <div key={index}>
                    <span>{host}</span>
                    <br></br>
                  </div>
                ))}
              </td>

              <td>
                <>
                  {r.segments.map((segment, i) => {
                    if (i === r.segments.length - 1) return;
                    return (
                      <div key={i}>
                        <b>
                          {segment.themes.mainTheme?.toUpperCase() +
                            '/' +
                            //JSON.stringify(segment.themes.subTheme)
                            segment.themes.subTheme.map(subThemes => subThemes)}
                        </b>

                        <br></br>
                        <br></br>
                        <b>{segment.segmentAnalysis.anchor.name?.toUpperCase()}</b>
                        <br></br>
                        <b>
                          {segment.segmentAnalysis.anchor.description !== '' &&
                            '\u2022  ' + segment.segmentAnalysis.anchor.description}
                        </b>
                        <br></br>
                        <br></br>
                        <br></br>
                        <h>Segment Analysis:</h>
                        <br></br>
                        {segment.segmentAnalysis.analysis.analyst}
                        <br></br>
                        <b>Scale : {segment.segmentAnalysis.analysis.scale}</b>
                        <br></br>
                        <br></br>
                        {segment.segmentAnalysis.summary.map((participants, i) => {
                          return (
                            <div key={i}>
                              {participants.participant +
                                '(' +
                                participants.pillar +
                                ')' +
                                '(' +
                                participants.sentiment +
                                ')'}
                              <br></br>
                              {participants.statement}
                              <br></br>
                              <br></br>
                            </div>
                          );
                        })}
                        <br></br>
                        <br></br>
                        <br></br>
                      </div>
                    );
                  })}
                </>
              </td>

              <td>
                <b>
                  {r.segments.map((segment, i) => {
                    if (i === r.segments.length - 1) return;
                    return (
                      <div key={i}>
                        <b>
                          {segment.themes.mainTheme?.toUpperCase() +
                            '/' +
                            segment.themes.subTheme.map(subThemes => subThemes)}
                        </b>
                        <br></br>
                        <br></br>

                        {_.toPairs(segment.segmentAnalysis.trend)?.map(([key, value]) => (
                          <div key={key}>
                            <b>
                              {key.toUpperCase() + ':  '}
                              {'   ' + value}
                            </b>
                            <br></br>
                          </div>
                        ))}
                        <br></br>
                      </div>
                    );
                  })}
                </b>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
};

export default PDF;
