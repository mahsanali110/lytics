export const updateJobArr = (arr, job) => {
  let jobId = job.results[0].id;
  let newJobs = arr.filter(j => j.id !== jobId);
  return [...newJobs, job.results[0]];
};
export const handleSingleJob = (actionType, totalJobs = [], JobToUpdate, wordCount) => {
  if (actionType == 'GET_JOB_BY_ID_SUCCESS') JobToUpdate.wordCount = wordCount;
  return totalJobs.map(job => (job.id === JobToUpdate.id ? JobToUpdate : job));
};

export const handleUpdateResults = (oldArr, newResults) => {
  const hashMap = {};
  newResults.map(job => (hashMap[job.id] = job));
  const freshResults = oldArr.map(job => {
    if (hashMap[job.id]) return hashMap[job.id];
    return job;
  });
  return freshResults;
};

export const getJobById = (id, jobArr) => {
  const job = jobArr.find(job => job.id === id);
  if (job) return job;

  return {
    translation: [],
    transcription: [],
  };
};
