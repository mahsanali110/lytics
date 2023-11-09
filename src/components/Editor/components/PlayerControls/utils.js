import moment from 'moment';
export const updateSegmentTime = (i, segments, time) => {
  const liveSegment = segments.filter(segment => segment.position == null)[0];
  liveSegment.time = time;
  return [...segments.filter(segment => segment.position !== null), liveSegment];
};

export const createParts = (segments, startTime) => {
  const _from = segments.filter(segment => segment.position == 'start')[0].time;
  const _to = segments.filter(segment => segment.position == 'end')[0].time;
  console.log({ _from, _to });
  return createSegmentBoundry(startTime, _from, _to);
};
const createSegmentBoundry = (dateTime, from, to) => ({
  from: addTimeToDate(dateTime, from),
  to: addTimeToDate(dateTime, to),
});
const addTimeToDate = (date, seconds, format = 'YYYY-MM-DD HH:mm:ss') => {
  const _date = moment(date);
  return _date.add(seconds, 'seconds').format(format);
};
