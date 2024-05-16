export const parseErrors = (errors: any) => {
  let errorMessage = "";
  if (errors && errors.fieldErrors) {
    const fieldErrors = errors.fieldErrors;
    for (const errors of Object.values(fieldErrors)) {
      for (const error of errors as any[]) {
        errorMessage += error + "; ";
      }
    }
  }

  return errorMessage;
};
