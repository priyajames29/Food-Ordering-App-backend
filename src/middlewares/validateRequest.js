export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      console.log("Validated request");
      next();
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };
}
