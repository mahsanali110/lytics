import { pickBy, identity, isEmpty } from 'lodash';

const getTargetField = key => {
  const fields = { escalations: 'to' };

  return fields[key] ?? 'name';
};

const makeFilterExpression = (data, filter) => {
  return Object.entries(filter).reduce((result, [key, val]) => {
    // If the target key is an array
    if (Array.isArray(data[key])) {
      return (
        result &&
        data[key].map(row => row[getTargetField(key)].toLowerCase()).includes(val.toLowerCase())
      );
    }

    return val ? result && data[key]?.toLowerCase() === val.toLowerCase() : result;
  }, true);
};

const useLocalFilter = () => {
  const applyFilter = (data, _filter) => {
    const filter = pickBy(_filter, identity);

    if (isEmpty(filter)) return data;

    return data.filter(entry => makeFilterExpression(entry, filter));
  };

  return applyFilter;
};

export default useLocalFilter;
