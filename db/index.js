const { Client } = require('pg');
const { rows } = require('pg/lib/defaults');

const client = new Client('postgres://localhost:5432/juicebox-dev');

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
      SELECT
        id, username, name, location, active
      FROM
        users;
    `);
    return rows;
  }
  catch (e) {
    throw e;
  }
}

const getAllPosts = async () => {
  try {
    const { rows } = await client.query(`
      SELECT
        id, "authorId", title, content, active
      FROM
        posts;
    `);
    return rows;
  }
  catch (e) {
    throw e;
  }
}

const updateUser = async (id, fields = {}) => {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [ user ] } = await client.query(`
      UPDATE 
        users
      SET 
        ${ setString }
      WHERE
        id=${ id }
      RETURNING *;
    `, [...Object.values(fields)]);

    return user;
  }
  catch (e) {
    throw e;
  }
}

const updatePost = async (id, fields = {}) => {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) return;

  try {
    const { rows: [ post ] } = await client.query(`
      UPDATE
        posts
      SET
        ${ setString }
      WHERE
        id=${ id }
      RETURNING *;
    `, [...Object.values(fields)]);

    return post;
  }
  catch (e) {
    throw e;
  }
}

const createUser = async ({ username, password, name, location }) => {
  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO 
        users (username, password, name, location) 
      VALUES
        ($1, $2, $3, $4)
      ON CONFLICT 
        (username) DO NOTHING
      RETURNING *;
    `, [username, password, name, location]);
    return user;
  }
  catch (e) {
    throw e;
  }
}

const createPost = async ({ authorId, title, content }) => {
  try {
    const { rows: [ post ] } = await client.query(`
      INSERT INTO 
        posts ("authorId", title, content) 
      VALUES
        ($1, $2, $3)
      RETURNING *;
    `, [authorId, title, content]);
    return post;
  }
  catch (e) {
    throw e;
  }
}

const getPostsByUser = async (userId) => {
  try {
    // console.log('Getting posts by user id');
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=$1;
    `, [userId]);
    return rows;
  }
  catch (e) {
    throw e;
  }
}

const getUserById = async (userId) => {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT * FROM users
      WHERE id=$1
    `, [userId]);
    user.posts = await getPostsByUser(userId);
    return user;
  }
  catch (e) {
    throw e;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById
}