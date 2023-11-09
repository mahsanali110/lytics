export const convertCompObjectToId = formDetails => {
  if (formDetails.company) {
    formDetails.company = formDetails.company.id;
  }
  return formDetails;
};
