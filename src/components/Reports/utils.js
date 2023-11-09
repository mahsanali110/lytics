import _ from 'lodash';
export const modifyOptions = (arr, key, top = '') => {
  if (key == 'title') {
    let types = _.uniqBy(arr, 'type');
    let typeOptions = types.map(type => {
      return {
        title: type.type,
      };
    });
    arr = [...typeOptions, ...arr];
    arr = _.uniqBy(arr, key);
  }

  if (key && top) {
    let arr2 = [{ [key]: 'All' }, { [key]: 'Top 5' }, { [key]: 'Top 10' }];
    if (arr?.length) arr = [...arr2, ...arr];
    return [...arr];
  } else if (key) {
    let item = {};
    item[key] = 'All';
    if (arr?.length) arr = [item, ...arr];
    return [...arr];
  } else {
    return [...arr];
  }
};
export const onSelect = (value, field, options = [], state, setState) => {
  if (field == 'programName') {
    let types = _.uniqBy(options, 'type');
    let typeOptions = types.map(type => {
      return {
        title: type.type,
      };
    });
    options = [...typeOptions, ...options];
    options = _.uniqBy(options, 'title');
  }
  let _field =
    field === 'programType'
      ? 'type'
      : field === 'programName'
      ? 'title'
      : field === 'theme'
      ? 'name'
      : field;
  let optionsValue = [];
  if (field === 'subTheme') {
    options.forEach(val => {
      val[_field].map(el => optionsValue.push(el));
    });
  } else {
    optionsValue = options.map(val => val[_field]);
  }
  if (value === 'All') {
    setState({ ...state, [field]: [value, ...optionsValue] });
  } else if (value === 'Top 5' || value === 'Top 10') {
    setState({ ...state, [field]: [value] });
  } else {
    if (state[field].length + 1 === optionsValue.length) {
      setState({ ...state, [field]: ['All', ...optionsValue] });
    } else {
      let previous = state[field].filter(val => val !== 'Top 5');
      previous = previous.filter(val => val !== 'Top 10');
      setState({ ...state, [field]: [...previous, value] });
    }
  }
};
export const onDeselect = (value, field, state, setState) => {
  if (value === 'All') {
    setState({ ...state, [field]: [] });
  } else {
    let newValues = [];
    state[field].forEach(val => {
      if (!(val == ' All' || val == value)) newValues.push(val);
    });
    setState({ ...state, [field]: [...newValues] });
  }
};

export const onClear = (field, state, setState) => {
  setState({ ...state, [field]: [] });
};
