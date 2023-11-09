export const convertComp = formDetails => {
  if (formDetails.companies && formDetails.companies.length) {
    formDetails.companies = formDetails.companies.map(com => com.id);
  }
  return formDetails;
};

export const makeCompanyMap = groups => {
  let map = {};
  groups.forEach(group => {
    group.companies.forEach(com => {
      map[com.name] = group.name;
    });
  });

  return map;
};
