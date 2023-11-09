/* global window */
import { PRIORITY_COLORS, STATUS_COLORS } from 'constants/options';
import { ACTUS_HOST, ACTUS_VIDEOS_API_PATH } from 'constants/index';
import moment from 'moment';
import _ from 'lodash';
import { colors } from 'constants/colors';
import { newRefreshTokenTimeInterval } from '../../constants/options';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as html2canvas from 'html2canvas';

import {
  onlineVideo,
  tvBreakingnews,
  tvTalkShow,
  tvPressConference,
  webNews,
  webOpinion,
  twitterNews,
  twitterOpinion,
  printOpinion,
  printNews,
  ticker,
} from 'assets/icons';
import guests from 'services/guests';
const host = window.location.origin;
var url = String(window.location.pathname);
export const getUserId = () => window.localStorage[`${host}_uid`] ?? '';
export const getTokens = () => JSON.parse(window.localStorage?.[`${host}_tokens`] ?? '{}');
export const getUser = () => JSON.parse(window.localStorage?.[`${host}_user`] ?? '{}');

export const unSetUserData = () => {
  // window.localStorage.removeItem(`${host}_uid`);
  // window.localStorage.removeItem(`${host}_tokens`);
  window.localStorage.removeItem(`${host}_user`);
};

export const setUserData = user => {
  // window.localStorage.setItem(`${host}_uid`, user.id);
  // window.localStorage.setItem(`${host}_tokens`, JSON.stringify(user.tokens));
  window.localStorage.setItem(`${host}_user`, JSON.stringify(user));
};

export const setSessionCookies = user => {
  window.localStorage[`${host}_user`] = JSON.stringify(user.user);
  window.localStorage[`${host}_uid`] = user.user.id;
  window.localStorage[`${host}_tokens`] = JSON.stringify(user.tokens);
  window.localStorage[`${host}_uuid`] = JSON.stringify(user.tokens);
  window.localStorage[`${host}_refresh_time`] = JSON.stringify(newRefreshTokenTimeInterval);
  window.localStorage[`${host}_login_time`] = moment();
  window.localStorage[`${host}_login`] = 'true';
};

export const updateUserinLocalStorage = user => {
  window.localStorage[`${host}_user`] = JSON.stringify(user);
};

export const unSetSessionCookies = () => {
  window.localStorage.removeItem(`${host}_user`);
  window.localStorage.removeItem(`${host}_uid`);
  window.localStorage.removeItem(`${host}_tokens`);
  window.localStorage.removeItem(`${host}_uuid`);
  window.localStorage.removeItem(`${host}_refresh_time`);
  window.localStorage.removeItem(`${host}_login_time`);
  window.localStorage.removeItem(`${host}_login`);
  window.localStorage.removeItem('start_date');
  window.localStorage.removeItem('end_date');
  window.localStorage.removeItem('currentPage');
};

export const setTokens = tokens => {
  window.localStorage[`${host}_tokens`] = JSON.stringify(tokens);
};

export const getLastPath = url => {
  const parts = url.split('/');
  if (parts[parts.length - 1].length === 0) {
    return parts[parts.length - 2];
  }
  return parts[parts.length - 1];
};

export const getQueryParam = (name, query) => {
  const regx = new RegExp(`${name}=([^&]*)`);
  const tokens = query.match(regx);
  return tokens ? tokens[1] : undefined;
};

export const transformFormValues = (data, fields, defaultValue = null) => {
  return fields.reduce((prev, field) => {
    if (field && typeof field === 'object') {
      let value = data[field.name];
      if (value && typeof value === 'string') {
        value = value.trim() || field.defaultValue || defaultValue;
      }
      prev[field] = value;
    }
    if (typeof field === 'string') {
      let value = data[field];
      if (value && typeof value === 'string') {
        value = value.trim() || defaultValue;
      }
      prev[field] = value;
    }

    return prev;
  }, {});
};

export const getDurationParams = (key, range) => {
  const params = { period: key };
  const format = 'YYYY-MM-DDTHH:mm:ss';
  if (key === 'custom') {
    if (range.length === 2) {
      // const dateFormat = 'YYYY-MM-DD';
      let [fromDate, toDate] = range;
      if (fromDate.format(format) === toDate.format(format)) {
        fromDate = fromDate.subtract(1, 'days');
      }
      fromDate = fromDate.utc().format(format);
      toDate = toDate.utc().format(format);
      params.fromDate = fromDate;
      params.toDate = toDate;
      return params;
    }
    return null;
  }
  params.toDate = moment.utc().format(format);
  if (key === 'day') {
    params.fromDate = moment.utc().subtract(1, 'days').format(format);
  } else if (key === 'week') {
    params.fromDate = moment.utc().subtract(7, 'days').format(format);
  } else if (key === 'month') {
    params.fromDate = moment.utc().subtract(1, 'months').format(format);
  } else if (key === 'quarter') {
    params.fromDate = moment.utc().subtract(3, 'months').format(format);
  }
  return params;
};

const returnMiliSeconds = () => {
  const now = moment().format('MMMM D, YYYY HH:mm:ss Z');
  const then = ' Jan 1, 1970 10:10:00 GMT+0500';

  const ms = moment(now, 'MMMM D, YYYY HH:mm:ss Z').diff(moment(then, 'MMMM D, YYYY HH:mm:ss Z'));
  const d = moment.duration(ms);
  return Math.floor(d.asMilliseconds());
};
export const formateTime = time => {
  const [startTime, endTime] = time?.split(' to ') ?? [];
  let ST = moment(startTime, ['hh:mm:ss A']);
  let ET = moment(endTime, ['hh:mm:ss A']);
  var t = ST.format('HH:mm:ss') + ' to ' + ET.format('HH:mm:ss');
  return t;
};
export const formatDate = (date, format) => {
  return moment(date).format(format);
};
export const formatUTCDate = (date, format) => {
  return moment.utc(date).format(format);
};

export const timeDifference = (startTime, endTime, format) => {
  const start = moment(startTime, ['hh:mm:ss']);
  const end = moment(endTime, ['hh:mm:ss']);
  const diff = end.diff(start, format);
  return diff;
};
export const sourceBtn = text => {
  let btnColor = '';
  if (text === 'Tv') {
    btnColor = '#0FA3B1';
  } else if (text === 'Print') {
    btnColor = '#C696FF';
  } else if (text === 'Blog') {
    btnColor = '#FF9B42';
  } else if (text === 'Online') {
    btnColor = '#F1BF98';
  } else if (text === 'Social') {
    btnColor = '#00ACEE';
  } else if (text === 'Ticker') {
    btnColor = '#F26A32';
  } else if (text === 'Twitter') {
    btnColor = '#F26A32';
  }
  return btnColor;
};
export const createThumbnail = (channel, time) =>
  `${ACTUS_HOST}/api/channels/${channel}/thumbnail?time=${formatDate(time, 'YYYY_MM_DD_HH_mm_ss')}`;

export const modifySeg = (obj, guest) => {
  const summary = guest.map(gue => {
    return { statement: '', participant: gue.name, pillar: '', sentiment: '' };
  });
  obj.segmentAnalysis.summary = [...summary];
  return { ...obj };
};

export const modifyAllSeg = (arr, guests) => {
  let newArr = arr.map(segment => {
    let summary = guests.map((gue, i) => {
      return { statement: '', participant: '', pillar: '', sentiment: '' };
    });
    segment.segmentAnalysis.summary = [...summary];
    return segment;
  });

  return [...newArr];
};

export const calcSegmentTime = (totalTime, segmentEndTime, prevSegEndTime, i) => {
  let [startTime, endTime] = totalTime?.split(' to ') ?? [];
  let ST = moment(startTime, ['hh:mm:ss A']);
  let ET = moment(endTime, ['hh:mm:ss A']);
  let et = ET.format('HH:mm:ss');
  let st = ST.format('HH:mm:ss');
  ST = moment(st, ['HH:mm:ss']).add(segmentEndTime, 'second');
  let segEndTime = ST.format('HH:mm:ss');
  let segStartTime;
  if (!prevSegEndTime) {
    segStartTime = st;
  } else {
    ST = moment(st, ['HH:mm:ss']).add(prevSegEndTime, 'second');
    segStartTime = ST.format('HH:mm:ss');
  }
  return segStartTime + ' to ' + segEndTime;
};

export const pascalCase = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getStatusColor = text => STATUS_COLORS[text];
export const getPriorityColor = text => PRIORITY_COLORS[text];

export const createParts = (segments, startTime, from) => {
  return segments.map((segment, index) => {
    const prevSeg = segments[index - 1];
    const _from = prevSeg?.time ?? from;
    const _to = segment.time;
    const segmentDuration = _to - _from;
    return createSegmentBoundry(startTime, _from, _to, segment.active, segmentDuration);
  });
};

export const createSegmentBoundry = (dateTime, from, to, active, segmentDuration) => ({
  from: addTimeToDate(dateTime, from),
  to: addTimeToDate(dateTime, to),
  active,
  segmentDuration,
});
const addTimeToDate = (date, seconds, format = 'YYYY-MM-DD HH:mm:ss') => {
  const _date = moment(date);
  return _date.add(seconds, 'seconds').format(format);
};

export const makeTextFrom = (arr, currentTime, type = 'text') => {
  let uniqueTags = [];
  arr?.map(j => {
    if (uniqueTags.indexOf(j.speaker) === -1) {
      uniqueTags.push(j.speaker);
    }
  });
  if (!arr?.length) return '';
  let res = arr.reduce((acc, c, index) => {
    // const [start, end] = c.duration.split('-');
    const start = c.duration.split('-')[0];
    let end;
    if (index < arr.length - 1) {
      end = arr[index + 1]?.duration.split('-')[0];
    } else {
      end = arr[index]?.duration.split('-')[1];
    }

    var colors = [
      'FF4D4F',
      'FF7A45',
      'FA8C16',
      'A0D911',
      'FFD666',
      'FADB14',
      'EB2F96',
      'a2db',
      'FF616D',
      'BF1363',
      'BB371A', //
      'FF4D4F',
      'FF7A45',
      'FA8C16',
      'A0D911',
      'FFD666', //
      'EB2F96',
      'a2db',
      'FF616D',
      'BF1363',
      'BB371A',
      'CD113B',
      'D83A56',
      'F54748',
      'BB371A',
      'FFC947',
      'F55C47',
      'F21170',
      'FF8303',
      'FED049',
    ];
    let selected;
    uniqueTags.map((uni, index) => {
      if (uni === c.speaker) {
        selected = +start <= currentTime && +end > currentTime && 'bg-selected';
        acc += `<span  id='${selected + type}' class="editable-${type} ${selected} ${
          colors[index]
        } nowrap" data-time='${c.duration}' speaker="${c.speaker.trim()}" tagattr="${
          c.speaker.trim() + type
        }">${c.line}</span>`;
      }
    });

    return acc;
  }, '');
  return res;
};

export const rowCOl = (arr, currentTime, type = 'text') => {
  let uniqueTags = [];
  if (typeof arr === 'string') {
    return;
  }
  arr?.map(j => {
    if (uniqueTags.indexOf(j.speaker) === -1) {
      uniqueTags.push(j.speaker);
    }
  });
  let tempArray = [];
  if (arr && arr.length > 0) {
    let currSpeaker = arr[0].speaker;
    let currlines = [];
    arr.map((obj, index) => {
      if (obj.speaker == currSpeaker) {
        currlines.push(obj);
        if (index === arr.length - 1) {
          tempArray.push({ speaker: currSpeaker, lines: currlines });
        }
      } else {
        tempArray.push({ speaker: currSpeaker, lines: currlines });
        currlines = [];
        currSpeaker = obj.speaker;
        currlines.push(obj);
        if (index === arr.length - 1) {
          tempArray.push({ speaker: currSpeaker, lines: currlines });
        }
      }
    });
    let finalarray = [];
    tempArray.map(obj => {
      let res = makeTextFrom(obj.lines, currentTime, type);
      finalarray.push({ speaker: obj.speaker, spans: res });
    });
    let string = '';
    finalarray.map(obj => {
      string += `<div class="abc" > <div id="speaker${type}" class="speaker ${
        colors[uniqueTags.indexOf(obj.speaker)]
      }" speakerTag="true"  contentEditable=${false}>${obj.speaker}</div> <div  class="tag">${
        obj.spans
      }</div></div>`;
    });

    if (string !== undefined) {
      return string;
    } else {
      return '';
    }
  }
};
export const calculateWidth = ({ currentTime, duration }) => {
  if (!currentTime || !duration) return 0;

  return (currentTime / duration) * 100;
};

export const setSegmentTime = (segments, payload) => {
  segments[segments.length - 1].time = payload;
  let _segments = [...segments];
  return _segments;
};

export const deleteAllSegments = segments => {
  let _segments = segments.filter((_, index) => index === segments.length - 1);
  return _segments;
};

export const updateSegmentTime = (i, segments, time) => {
  segments[i].time = time;
  return [...segments];
};

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const createSegmentThumbnail = (segments, currentSegmentTime, startTime, channel) => {
  segments.reverse();
  const prevSegTime = segments.find(segment => segment.time < currentSegmentTime)?.time ?? 0;
  let thumbnailTime = prevSegTime
    ? moment(startTime).add(prevSegTime, 'seconds')
    : moment(startTime);
  const thumbnail = createThumbnail(channel, thumbnailTime);
  return thumbnail;
};
export const convertHMS = value => {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
};

//////////////////////////////////////////////////
///////// to convert topic data //////////////////
//////////////////////////////////////////////////

export const convert = (dataSet, nestedKeys = ['topic2', 'topic3', 'children']) => {
  const newSet = [];
  const topicMap = {};
  dataSet.map((topic, index) => {
    return makeKeys(topic, `0-${index}`, 0, nestedKeys, topic.name, null);
  });

  function makeKeys(obj, key, level = 0, nestedKeys, parent, topic2 = null) {
    let secondParent;
    obj.title = obj.name;
    obj.key = key;
    obj.value = key;
    obj.level = level;
    if (level === 1) {
      obj.topic1 = parent;
      obj.parentId = key
        .split('-')
        .filter((_, i) => i < 2)
        .join('-');
    }
    if (topic2) {
      obj.secondParent = topic2;
      obj.topic1 = parent;
      obj.parentId = key
        .split('-')
        .filter((_, i) => i < 2)
        .join('-');
    }

    topicMap[obj.key] = { parent, name: obj.title };

    if (level == 0) newSet.push(obj);
    if (level == 1) secondParent = obj.name;

    const nestedField = nestedKeys.reduce((field, item) => {
      if (obj && Object.prototype.hasOwnProperty.call(obj, item)) {
        field = item;
      }
      return field;
    }, '');

    if (nestedField == '' || !obj[nestedField]) return;
    obj.children = obj[nestedField];
    // if (nestedField !== 'children') delete obj[nestedField];
    obj.children.map((child, index) =>
      makeKeys(child, `${obj.key}-${index}`, level + 1, nestedKeys, parent, secondParent)
    );
  }
  return [newSet, topicMap];
};

//////////////////////////////////////////////////
///////// to convert group data //////////////////
//////////////////////////////////////////////////

export const convertGroups = (
  dataSet,
  nestedKeys = ['topic2', 'topic3', 'children'],
  titleKeys = ['name', 'compName', 'firstName']
) => {
  // const newSet = [];
  const map = {};

  const _newSet0 = dataSet.map((group, index) => {
    return makeKeys(group, `0-${index}`, 0, nestedKeys, group.id);
  });

  function makeKeys(obj, key, level = 0, nestedKeys, parentId) {
    let _obj = { ...obj };
    const titleField = titleKeys.reduce((field, item) => {
      if (_obj && Object.prototype.hasOwnProperty.call(_obj, item)) {
        field = item;
      }
      return field;
    }, '');
    titleField === 'firstName'
      ? (_obj.title = `${_obj[titleField]} ${_obj['lastName']}`)
      : (_obj.title = _obj[titleField]);

    // debugging session
    // if (level === 2 && obj.title === 'qa reviewer') {
    //   console.log({ obj, parentId });
    // }

    // if (level == 1) console.log({ userId: obj.id, parentId });
    _obj.key = level == 2 ? parentId : key;
    _obj.value = level == 2 ? parentId : key;
    if (level == 2)
      map[parentId] = { title: _obj.title, company: _obj?.company?.id || 'no company' };

    // if (level == 0) newSet.push(_obj);

    const nestedField = nestedKeys.reduce((field, item) => {
      if (_obj && Object.prototype.hasOwnProperty.call(_obj, item)) {
        field = item;
      }
      return field;
    }, '');

    if (nestedField == '' || !obj[nestedField]) return { ..._obj };
    _obj.children = _obj[nestedField];
    // if (nestedField !== 'children') delete _obj[nestedField];
    let newChildren = _obj.children.map((child, index) =>
      makeKeys(child, `${_obj.key}-${index}`, level + 1, nestedKeys, `${parentId}-${child.id}`)
    );
    let _object = { ..._obj };
    _object.children = [...newChildren];
    return { ..._object };
  }

  /////// filter out empty companies (e.g without users)
  function filterEmptyObjects(obj, level = 0) {
    if (level === 2) return true; // return ture if its user
    let _obj = { ..._.cloneDeep(obj) };
    if (obj?.children) {
      _obj.children = _obj.children.filter(child => filterEmptyObjects(child, level + 1));

      if (_obj.children.length) {
        obj.children = _obj.children;
        return true; // return true if obj had children
      }
      return false; // return false if obj.children is empty array
    }
    /// return if object don't have children prop
    return false;
  }

  const _newSet = _newSet0.filter(obj => filterEmptyObjects(obj));

  return [_newSet, map];
};

export const getTopicKeys = (keys, topic1 = false, topic2 = false) => {
  let topic1Key,
    topic2Keys = [];

  if (topic1 && topic2) {
    topic1Key = keys[0].split('-').slice(0, 2).join('-');
    keys.map(key => {
      let newKey = key.split('-').slice(0, 3).join('-');
      if (topic2Keys.includes(newKey)) return;
      topic2Keys.push(newKey);
    });
    return { topic1Key, topic2Keys };
  }

  if (topic1) {
    topic1Key = keys[0].split('-').slice(0, 2).join('-');
    return topic1Key;
  }

  if (topic2) {
    keys.map(key => {
      let newKey = key.split('-').slice(0, 3).join('-');
      if (topic2Keys.includes(newKey)) return;
      topic2Keys.push(newKey);
    });
    return topic2Keys;
  }
};

export const getTopicValue = (topicKey, map, topics = false) => {
  let value;
  if (!topics) {
    if (Array.isArray(topicKey)) {
      value = topicKey.map(key => map[key]);
    } else {
      value = map[topicKey] || '';
    }
    return value;
  }

  if (Array.isArray(topicKey)) {
    value = topicKey.map(key => map[key].name);
  } else {
    value = map[topicKey].name || '';
  }

  return value;
};

export const getTopicKeyFromValue = (values, map, parent) => {
  let key;
  if (Array.isArray(values)) {
    key = values.map(value => {
      return Object.keys(map).find(key => map[key].parent === parent && map[key].name === value);
    });
  } else {
    key = Object.keys(map).find(key => map[key].parent === parent && map[key].name === values);
  }
  return key;
};

export const SelectAll = { title: 'All', value: 'All' };

export const isNewTopic = (prevValue, newValue) => {
  const oldParent = getTopicKeys([prevValue], true);
  const newParent = getTopicKeys([newValue], true);
  if (oldParent === newParent) return false;
  return true;
};

const iconsTV = {
  'Talk Show': tvTalkShow,
  'Press Conference': tvPressConference,
  'news bulletin': tvBreakingnews,
};

const iconsPrint = {
  Opinion: tvTalkShow,
  News: tvPressConference,
};

export const selectIcon = (source, type = 'Talk Show') => {
  if (source === 'Tv') return iconsTV[type];
  if (source === 'Online') return onlineVideo;
  if (source === 'Ticker') return ticker;
  if (source === 'Print') return printNews;
  if (source === 'Blog') return webOpinion;
  if (source === 'Twitter') return twitterOpinion;
};

export const numList = n => {
  const arr = [];
  for (var i = 1; i <= n; i++) {
    arr.push(`${i}`);
  }
  return arr;
};

export async function downloadVideo(url, fileName) {
  let _url = `${ACTUS_VIDEOS_API_PATH}/2022_11_14/Capital_Talkk_1668402776090.mp4`;
  try {
    const response = await axios({
      method: 'GET',
      url: _url,
      responseType: 'blob',
      crossdomain: true,
    });
    console.log({ response });
    var blob = new Blob([response.data], {
      type: 'video/mp4',
    });

    saveAs(blob, 'example.mp4');
  } catch (error) {
    console.log({ error });
  }
}

export function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

export function isKeyPresent(obj, key) {
  return obj.hasOwnProperty(key);
}

export function convertToMilliseconds(timeString) {
  const time = moment.duration(timeString);
  return time.asMilliseconds();
}

//// to combine guest name association and description
export const makeGuestString = guest => {
  const { name, association, description } = guest;
  let guestString = '';
  if (name) guestString = guestString.concat(name);
  if (association) guestString = guestString.concat(`|${association}`);
  if (description) guestString = guestString.concat(`|${description}`);
  return guestString;
};

export const checkSpecialCharacterExists = text => {
  const format = `/[!@#$%^*()_+\=\[\]{};':"\\,.<>\/?]+/;`;
  return format.split('').some(char => text.includes(char));
};

export const checkFontLanguage = str => {
  const urduRegex = /[\u0600-\u06FF]/; // matches any Urdu characters
  const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
  return hasUrdu ? 'Noto Nastaliq' : 'Roboto'; // return "rtl" if the string has Urdu characters, otherwise "ltr"
};

export const checkLanguageDirection = str => {
  const urduRegex = /[\u0600-\u06FF]/; // matches any Urdu characters
  const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
  return hasUrdu ? 'rtl' : 'ltr'; // return "rtl" if the string has Urdu characters, otherwise "ltr"
};

export const splitSocialWord = str => {
  const urduRegex = /[\u0600-\u06FF\s]+/g; // matches any Urdu characters and white space
  const filteredText = str.match(urduRegex).join(''); // extracts the Urdu text and joins it together
  const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
  function hasNonSpaceCharacters(str) {
    return str.trim().length > 0;
  }
  if (filteredText && hasUrdu && hasNonSpaceCharacters(filteredText)) {
    return filteredText;
  } else {
    return str;
  }
};

export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
}

export async function converBase64formUrl(url) {
  try {
    const res = await axios.get(url, {
      responseType: 'blob',
    });
    const dataUrl = await convertToBase64(res.data);
    console.log({ dataUrl });
    return dataUrl;
  } catch (error) {
    console.log(error);
  }
}

export const getImage = async (src, alt) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(alt);
    image.src = src;
  });
};

export const convertImageToUrl = async node => {
  const canvas = await html2canvas(node, {
    // quality: 2,
    scale: 2,
  });

  const imgData = await canvas.toDataURL('image/png');
  return imgData;
};

export const arrayFromObjValue = obj => {
  if (!obj) return [];
  return Object.values(obj).filter(cha => !!cha);
};

export const makeUserAccess = userPannels => {
  const paths = userPannels.filter(({ isAssigned }) => isAssigned).map(({ path }) => path);
  const landingPage = paths[0] ?? '/not-found';
  return { paths, landingPage };
};
