const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: 'MissingUserError',
      message: 'You must be logged in to preform this action'
    });
  }
  next();
}

module.exports = {
  requireUser
}