const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: 'MissingUserError',
      message: 'You must be logged in to preform this action'
    });
  }
  next();
}

const requireActiveUser = (req, res, next) => {
  if (!req.user.active) {
    next({
      name: 'InactiveUserError',
      message: 'You must be logged in as an active user to preform this action'
    });
  }
  next();
}

module.exports = {
  requireUser,
  requireActiveUser,
}