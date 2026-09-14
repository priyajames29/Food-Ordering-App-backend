export function authorizeRole(...args) {
  const update = typeof args[0] === "boolean" ? args.shift() : false;
  const roles = args;

  return (req, res, next) => {
    if (update) {
      console.log(req.user.id, req.params.id);
      if (req.user.id !== Number(req.params.id)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    } else if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
}
