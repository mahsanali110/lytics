export const modifyOptions = (arr, top = '', subTopic = '') => {
  let options = [{ subTopic: 'All' }, { subTopic: 'Top 5' }, { subTopic: 'Top 10' }];
  if (top && subTopic) {
    return arr.length ? [...options, ...arr] : [...arr];
  } else if (!top) {
    return arr.length ? ['All', ...arr] : [...arr];
  } else {
    return arr.length ? ['All', 'Top 5', 'Top 10', ...arr] : [...arr];
  }
};

export const onSelect = (value, options, state, setState, subTopic = false) => {
  let _options = [];
  subTopic
    ? options.forEach(option => {
        option.subTopic.forEach(opt => _options.push(opt.name));
      })
    : (_options = options);
  if (value === 'All') {
    setState([value, ..._options]);
  } else if (value === 'Top 5' || value === 'Top 10') {
    setState([value]);
  } else {
    if (state.length + 1 === _options.length) {
      setState(['All', ..._options]);
    } else {
      let previous = state.filter(val => val !== 'Top 5');
      previous = previous.filter(val => val !== 'Top 10');
      setState([...previous, value]);
    }
  }
};

export const onDeselect = (value, options, state, setState) => {
  if (value === 'All') {
    setState([]);
  } else {
    let newValues = [];
    state.forEach(val => {
      if (!(val == 'All' || val == value)) newValues.push(val);
    });
    setState([...newValues]);
  }
};
