export const replaceArrWith = (arr, obj, index = 0) => arr.splice(index, 1, obj);

export const updateArrOf = (arr, { index = 0, field, value, nestedKey = '' }) => {
  const result = arr.find((_, i) => i == index);
  const targetRow = nestedKey.split('.').reduce((acc, c) => acc[c], result) ?? result;
  targetRow[field] = value;
  return arr;
};

export const removeFrom = (arr, { index }) => {
  const result = [...arr];
  result.splice(index, 1);

  return result;
};

export const updateSegmentTheme = (arr, index, field, value) => {
  arr[index].themes[field] = value;
  return [...arr];
};

export const updateSegmentTopic1 = (arr, index, value) => {
  arr[index].topics.topic1 = value;
  return [...arr];
};

export const updateSegmentTopic2 = (arr, index, value) => {
  arr[index].topics.topic2 = value;
  return [...arr];
};

export const updateSegmentTopic3 = (arr, index, value) => {
  arr[index].topics = value;
  return [...arr];
};

export const updateSegmentField = (arr, { index, field, value }) => {
  arr[index][field] = value;
  return [...arr];
};
export const updateSegmentSummary = (arr, { index, field, value, segIndex }) => {
  let summaryNew = arr[segIndex].segmentAnalysis.summary;
  if (index > summaryNew.length - 1) {
    summaryNew.push({ statement: '', participant: value, pillar: '', sentiment: '' });
    arr[segIndex].segmentAnalysis.summary = [...summaryNew];
    console.log({ arr });
    return [...arr];
  } else {
    arr[segIndex].segmentAnalysis.summary[index][field] = value;
    return [...arr];
  }
};

export const addGuestAnalysis = (state, payload) => {
  const { index, ...data } = payload;
  const segments = [...state.segments];

  const segment = segments.find((_, i) => i == index);
  segment.guestAnalysis = [...segment.guestAnalysis, data];
  segments[index] = segment;

  return {
    ...state,
    segments,
  };
};

export const removeGuestAnalysis = (state, payload) => {
  const { index, key } = payload;
  if (key == 0) {
    return {
      ...state,
    };
  }
  const segments = [...state.segments];

  const segment = segments.find((_, i) => i == index);
  console.log(segment);
  segment.guestAnalysis = [...removeFrom(segment.guestAnalysis, { index: key })];

  segments[index] = segment;

  return {
    ...state,
    segments,
  };
};

export const updateGuestAnalysis = (state, payload) => {
  const segments = [...state.segments];
  const segment = segments.find((_, i) => i == payload.index);

  segment.guestAnalysis = updateArrOf([...segment.guestAnalysis], {
    index: payload.key,
    field: payload.field,
    value: payload.value,
  });

  segments[payload.index] = segment;

  // return { ...state, segments: replaceArrWith(segments, segment, payload.index) };
  return { ...state, segments };
};

export const updateSegment = (segments, { index, id }) => {
  let endInd = index;
  for (var i = index + 1; i < segments.length; i++) {
    if (segments[i].active && !segments[i].merge) break;
    if (segments[i].active == false) continue;
    if (segments[i].merge == true) endInd = i;
  }
  segments.forEach((segment, i) => {
    if (i > endInd) return;
    segment.dragging = false;
  });
  segments[index].id = id;
  return [...segments];
};

export const updateJobField = (job, { field, value, fullField }) => {
  // ?? used fullField argument to get the full field from db/job
  const _job = { ...job };
  if (field == 'guests') {
    _job[field] = [];
    value.map((v, i) => {
      _job[field][i] = {
        name: v,
      };
    });
  } else if (field == 'programType') {
    _job[field] = value;
    _job.programName = '';
    _job.anchor = [];
  } else if (field == 'programName') {
    const hostArray = fullField ? fullField.filter(h => h.title === value).map(h => h.host)[0] : [];
    _job[field] = value;
    _job.anchor = hostArray;
  } else {
    _job[field] = value;
  }
  return _job;
};
