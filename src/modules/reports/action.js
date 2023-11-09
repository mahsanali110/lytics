import { createRequestTypes, action } from '../common/actions';

export const GET_TALKSHOW_REPORT = createRequestTypes('GET_TALKSHOW_REPORT');

export const pdfReport = {
  getTalkShowReport: {
    request: data => action(GET_TALKSHOW_REPORT.REQUEST, { payload: data }),
    success: data => {
      return action(GET_TALKSHOW_REPORT.SUCCESS, { payload: data });
    },
    failure: error => {
      return action(GET_TALKSHOW_REPORT.FAILURE, { payload: error });
    },
  },
};
