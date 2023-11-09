import { isEmpty, toLower, pick } from 'lodash';

const useSearch = () => {
  const applySearch = (collection, searchableFields, text = '') => {
    const validRequest = ![searchableFields, text, collection].some(item => isEmpty(item));

    if (!validRequest) return collection;

    return collection.filter(entry => {
      // Pick only those fields that are searchable
      const searchableObject = pick(entry, searchableFields);
      return Object.entries(searchableObject).some(([field, value]) => {
        if (['translation', 'transcription'].includes(field) && typeof value!=='string') {
          value = value?.reduce((acc, { line }) => (acc += line), '');
        }

        if (['guests'].includes(field)) {
          value = value.map(({ name }) => name);
        }

        if (['themes'].includes(field)) {
          value = value.map(({ mainTheme, subTheme }) => [mainTheme, ...subTheme]).flat();
        }

        return toLower(value).includes(toLower(text));
      });
    });
  };

  return applySearch;
};

export default useSearch;
