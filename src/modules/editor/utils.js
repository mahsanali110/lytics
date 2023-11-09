import { cloneDeep } from 'lodash';
export const updateStateField = (state, { field, value, nestedField }, initial) => {
  const _state = { ...cloneDeep(state) };
  if (nestedField) {
    _state[nestedField][field] = value;
  } else {
    _state[field] = value;
  }
  return _state;
};
