const express = require('express');
const usersRouter = express.Router();
const { 
  getAllUsers, 
  getUserByUsername, 
  createUser, 
  getUserById,
  updateUser,
} = require('../db');
const { requireUser, requireActiveUser } = require('./utils');

// giving them a token - necessary code
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;
// giving them a token - necessary code

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.send({ users });
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {

      // giving them a token - necessary code
      const token = jwt.sign({
        id: user.id,
        username: user.username,
        password: user.password
      }, JWT_SECRET);
      res.send({ message: "you're logged in!", token });
      // giving them a token - necessary code

    }
    else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }
  }
  catch (e) {
    console.log(e);
    next(e);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    const user = await createUser({
      username,
      password,
      name,
      location,
    });

    const token = jwt.sign({
      id: user.id,
      username
    }, JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({
      message: 'thank you for signing up',
      token
    });
  }
  catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.delete(
  '/:userId',
  requireUser,
  requireActiveUser,
  async (req, res, next) => {
    const { userId } = req.params;
    const user = await getUserById(userId);

    if (!user) {
      next({ 
        name: 'UserNotFoundError',
        message: 'No user with the given id was found'
      });
    }

    else if (userId == req.user.id) {
      const inactiveUser = await updateUser(userId, {active: false});
      res.send(inactiveUser);
    } 

    else {
      next({ 
        name: 'UnauthorizedDeleteRequestError',
        message: 'Attempted to delete an account you are not logged into'
      });
    }
  });

module.exports = usersRouter;