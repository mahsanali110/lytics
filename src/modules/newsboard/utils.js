const sourceMap = {
  Blog: 'printWeb',
  Print: 'printWeb',
  Tv: 'tvOnline',
  Online: 'tvOnline',
  Social: 'social',
  Ticker: 'ticker',
};
export const updateJobArray = (state, job) => {
  const targetArray = [...state[sourceMap[job.source]].results];
  const targetKey = sourceMap[job.source];

  // logic to add jobs on top if lates
  let newArray = [];
  const indexToAddJob = targetArray.findIndex(
    singleJob => new Date(job.broadcastDate) >= new Date(singleJob.broadcastDate)
  );
  if (indexToAddJob >= 0) {
    newArray = [...targetArray.slice(0, indexToAddJob), job, ...targetArray.slice(indexToAddJob)];
  } else {
    newArray = [...targetArray, job];
  }
  /////////////////////////////////////

  return {
    ...state,
    [targetKey]: {
      ...state[targetKey],
      results: [...newArray],
    },
  };
};
