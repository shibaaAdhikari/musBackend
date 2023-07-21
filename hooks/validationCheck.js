import { validationResult } from "express-validator";
import createError from "http-errors";

const validateInput = (req, next) => {
  const errors = validationResult(req);

  // check for validation error from validation check
  if (!errors.isEmpty()) {
    const invalidFields = errors.errors.map((errObj) => errObj.param);
    const errorMessage = `Invalid input: ${invalidFields.join(" ")}`;
    return next(createError(422, errorMessage));
  }
};

export default validateInput;
