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

  pdf.save('Report - ' + moment().format('DD-MM-YYYY'));
};

const PDF = ({ report }) => {
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
            {r.segments.map((segment, i) => {
              if (i === r.segments.length - 1) return;
              return (
                <tr>
                  <td>{i === 0 && index + 1}</td>
                  {i === 0 ? (
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
                  ) : (
                    <td></td>
                  )}
                  <td>
                    <div key={i}>
                      <b>
                        {segment.themes.mainTheme ? (
                          segment.themes.mainTheme?.toUpperCase() +
                          ' / ' +
                          segment.themes.subTheme.map(subThemes => subThemes)
                        ) : (
                          <></>
                        )}
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
                      <h1>SEGMENT ANALYSIS:</h1>
                      <br></br>
                      {segment.segmentAnalysis.analysis.analyst}
                      <br></br>
                      <b>SCALE : {segment.segmentAnalysis.analysis.scale}</b>
                      <br></br>
                      <br></br>
                      {segment.segmentAnalysis.summary.map((participants, i) => {
                        return (
                          <div key={i}>
                            {participants.participant ? (
                              participants.participant?.toUpperCase() +
                              '(' +
                              participants.pillar +
                              ')' +
                              '(' +
                              participants.sentiment +
                              ')'
                            ) : (
                              <></>
                            )}
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
                  </td>
                  <td>
                    <div key={i}>
                      <b>
                        {segment.themes.mainTheme ? (
                          segment.themes.mainTheme?.toUpperCase() +
                          ' / ' +
                          segment.themes.subTheme.map(subThemes => subThemes)
                        ) : (
                          <></>
                        )}
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </>
  );
};

export default PDF;
