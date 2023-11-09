import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import moment from 'moment';
import * as html2canvas from 'html2canvas';
var graphImage = '';

export const GenerateGraphReport = async (node, startDate, endDate, name) => {
  const { logo } = window['config'];
  const pdf = new jsPDF('p', 'mm', 'a4');
  if (pdf) {
    await html2canvas(node, {
      useCORS: true,
      quality: 1,
      width: '1800',
      height: '1800',
    }).then(async canvas => {
      const imgData = await canvas.toDataURL('image/png');

      graphImage = await imgData;
    });
  }
  let pageHeight = 297;
  let pageWidth = 210;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.text(115, 15, 'Talk Show Report', 'center');
  pdf.setFontSize(9);
  pdf.text(115, 20, `Generated At: ${moment().format('L')}`, 'center');
  pdf.line(200, 23, 10, 23);
  pdf.setFontSize(12);
  pdf.text(10, 30, 'Report from: ');
  pdf.setTextColor(0, 0, 139);
  pdf.text(35, 30, `${moment(startDate).format('L')}`);
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text(94, 30, 'to: ');
  pdf.setTextColor(0, 0, 139);
  pdf.setFontSize(12);
  pdf.text(100, 30, `${moment(endDate).format('L')}`);
  pdf.setTextColor(0, 0, 0);
  pdf.addImage(logo, 'JPEG', 10, 7, 25, 17);
  pdf.setTextColor(0, 0, 0);
  pdf.text(100, 38, 'DAILY SIGNIFICANT TALK SHOWS', 'center');
  pdf.line(135, 40, 65, 40);
  pdf.setLineWidth(1);
  pdf.addImage(graphImage, 'JPEG', 20, 70, 190, 120);

  await pdf.save(name + moment().format('DD-MM-YYYY'));
};
