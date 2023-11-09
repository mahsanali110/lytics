import { fork, all } from 'redux-saga/effects';

import {
  handleSignupSubmit,
  handleSigninSubmit,
  handleInternetKey,
  handleSignout,
  handleForgotPassword,
  handleChangePassword,
  handleResetPassword,
} from './auth/saga';

import { handleGetHomeDataTakeLatest } from './home/saga';
import { handleGetSearchedDataTakeLatest } from './search/saga';
import {
  getMarkerById,
  handleAnalysis,
  handleAnchor,
  handleSummary,
  updateMarker,
  updateSentiment,
} from './markerEdit/saga';
import {
  fetchHosts,
  fetchThemes,
  fetchGuests,
  fetchProgramNames,
  fetchProgramTypes,
  fetchTopics,
} from './common/saga';
import hashtagWatcher from './common/saga';
import {
  fetchJobs,
  getJobById,
  updateJob,
  createJob,
  deleteJob,
  exportVideo,
  createMediaJobs,
  bulkEscalateJobs,
  lockJob,
  lockUnlockJob,
  unlockJob,
  createWebsiteJobs,
  createSocialJobs,
} from './jobs/saga';

import companyWatcher from './company/saga';
import groupWatcher from './groups/saga';
import writerWatcher from './writers/saga';

import { createLiveJob, updateLiveJob } from './LiveClipping/saga';
import usersSagas from './users/saga';
import themesSaga from './theme/saga';
import topicSaga from './topic/saga';
import channelsSagas from './channels/saga';
import programTypesSagas from './programTypes/saga';
import analyticsSagas from './analytics/saga';
import hostsSagas from './hosts/saga';
import programNamesSagas from './programNames/saga';
import associationsSagas from './associations/saga';
import guestsSagas from './guests/saga';
import workAssessmentSagas from './workAssessment/saga';
import alarmSagas from './alarms/saga';
import { handleReport } from './reports/saga';
import analyticsWatcher from './analytics/saga';
import contentExport from './contentExport/saga';
import filterSagas from './filter/saga';

import { handleGetChannelsDataTakeLatest } from './multiview/saga';
import printClipperWatcher from './printClipper/saga';
import { libraryJobsWatcher } from './libraryJobs/saga';
import { editorWatcher } from './editor/saga';
import newsBoardWatcher from './newsboard/saga';

export default function* rootSaga() {
  yield all([
    fork(handleGetChannelsDataTakeLatest),
    fork(handleGetHomeDataTakeLatest),
    fork(handleSignupSubmit),
    fork(handleSigninSubmit),
    fork(handleInternetKey),
    fork(handleSignout),
    // fork(handleSavePreset),
    // fork(handleAllGetPreset),
    // fork(handleGetSinglePreset),
    // fork(handleUpdatePreset),
    // fork(handleDeletePreset),
    fork(createWebsiteJobs),
    fork(createSocialJobs),
    fork(handleForgotPassword),
    fork(handleChangePassword),
    fork(handleResetPassword),
    fork(handleGetSearchedDataTakeLatest),
    fork(getMarkerById),
    fork(updateMarker),
    fork(fetchHosts),
    fork(fetchThemes),
    fork(fetchTopics),
    fork(fetchGuests),
    fork(fetchProgramNames),
    fork(fetchJobs),
    fork(getJobById),
    fork(updateJob),
    fork(deleteJob),
    fork(usersSagas),
    fork(channelsSagas),
    fork(programTypesSagas),
    fork(analyticsSagas),
    fork(hostsSagas),
    fork(programNamesSagas),
    fork(associationsSagas),
    fork(guestsSagas),
    fork(themesSaga),
    fork(workAssessmentSagas),
    fork(fetchProgramTypes),
    fork(alarmSagas),
    fork(createJob),
    fork(createMediaJobs),
    fork(lockJob),
    fork(lockUnlockJob),
    fork(unlockJob),
    fork(handleReport),
    fork(analyticsWatcher),
    fork(updateSentiment),
    fork(handleAnalysis),
    fork(handleAnchor),
    fork(handleSummary),
    fork(contentExport),
    fork(createLiveJob),
    fork(updateLiveJob),
    fork(topicSaga),
    fork(hashtagWatcher),
    fork(bulkEscalateJobs),
    fork(companyWatcher),
    fork(groupWatcher),
    fork(filterSagas),
    fork(writerWatcher),
    fork(printClipperWatcher),
    fork(libraryJobsWatcher),
    fork(editorWatcher),
    fork(newsBoardWatcher),
  ]);
}
