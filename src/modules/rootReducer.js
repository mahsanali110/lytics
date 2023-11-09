import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import homeReducer from './home/reducer';
import authReducer from './auth/reducer';
import commonReducer from './common/reducer';
import multiviewReducer from './multiview/reducer';
import markerEditReducer from './markerEdit/reducer';
import jobsReducer from './jobs/reducer';
import pageNavReducer from './navigation/reducer';
import usersReducer from './users/reducer';
import settingsReducer from './settings/reducer';
import channelsReducer from './channels/reducer';
import programTypesReducer from './programTypes/reducer';
import analyticsReducer from './analytics/reducer';
import hostsReducer from './hosts/reducer';
import writersReducer from './writers/reducer';
import programNamesReducer from './programNames/reducer';
import associationsReducer from './associations/reducer';
import guestsReducer from './guests/reducer';
import themesReducer from './theme/reducer';
import topicsReducer from './topic/reducer';
import workAssessmentReducer from './workAssessment/reducer';
import alarmReducer from './alarms/reducer';
import reportReducer from './reports/reducer';
import contentExportReducer from './contentExport/reducer';
import liveClippingReducer from './LiveClipping/reducer';
import companyReducer from './company/reducer';
import groupsReducer from './groups/reducer';
import filterReducer from './filter/reducer';
import jobfilterReducer from './jobfilters/reducer';
import printClipperReducer from './printClipper/reducer';
import editorReducer from './editor/reducer';
import libraryJobsReducer from './libraryJobs/reducer';
import newsboardReducer from './newsboard/reducer';
const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    authReducer,
    homeReducer,
    commonReducer,
    multiviewReducer,
    markerEditReducer,
    jobsReducer,
    pageNavReducer,
    settingsReducer,
    usersReducer,
    channelsReducer,
    programTypesReducer,
    analyticsReducer,
    hostsReducer,
    writersReducer,
    programNamesReducer,
    associationsReducer,
    guestsReducer,
    themesReducer,
    workAssessmentReducer,
    alarmReducer,
    reportReducer,
    contentExportReducer,
    liveClippingReducer,
    topicsReducer,
    companyReducer,
    groupsReducer,
    filterReducer,
    jobfilterReducer,
    printClipperReducer,
    editorReducer,
    libraryJobsReducer,
    newsboardReducer,
  });

export default rootReducer;
