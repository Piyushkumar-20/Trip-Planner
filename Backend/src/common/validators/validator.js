import ApiError from "../utils/api-error.js";

const validate = (Dtoclass) => {
  return (req, res, next) => {
    const { values, error } = Dtoclass.validate(req.body);
    if (error) {
      throw ApiError.badRequest(error.join("; "));
    }
    req.body = values;
    next();
  };
};
export default validate;
