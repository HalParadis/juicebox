const { 
  client, 
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getUserById
} = require('./index');

const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  }
  catch (e) {
    console.error("Error dropping tables!");
    throw e;
  }
}

const createTables = async () => {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    console.log("Finished building tables!");
  }
  catch (e) {
    console.error("Error building tables!");
    throw e;
  }
}

const createInitialUsers = async () => {
  try {
    console.log("Starting to create users...");

    await createUser({ 
      username: 'albert', 
      password: 'bertie99',
      name: 'Al',
      location: 'New York'
    });
    await createUser({ 
      username: 'sandra', 
      password: '2sandy4me',
      name: 'Sandy',
      location: 'Paris'
    });
    await createUser({ 
      username: 'glamgal', 
      password: 'soglam',
      name: 'Julia',
      location: 'Texas'
    });

    console.log("Finished creating users!");
  }
  catch (e) {
    console.error("Error creating users!");
    throw e;
  }
}

const createInitialPosts = async () => {
  try {
    console.log("Starting to create posts...");

    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "Al's Post",
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Varius quam quisque id diam vel. Quis risus sed vulputate odio ut enim. Nunc sed id semper risus in hendrerit gravida rutrum quisque.'
    });

    await createPost({
      authorId: sandra.id,
      title: "Sandy's Post",
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Varius quam quisque id diam vel. Quis risus sed vulputate odio ut enim. Nunc sed id semper risus in hendrerit gravida rutrum quisque.'
    });

    await createPost({
      authorId: glamgal.id,
      title: "Julia's Post",
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Varius quam quisque id diam vel. Quis risus sed vulputate odio ut enim. Nunc sed id semper risus in hendrerit gravida rutrum quisque.'
    });

    console.log("Finished creating users!");
  }
  catch (e) {
    throw e;
  }
}

const rebuildDB = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  }
  catch (e) {
    console.error(e);
  }
}

const testDB = async () => {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log('getAllUsers:', users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log('Calling updatePost on posts[0]');
    const updatePostResult = await updatePost(posts[0].id, {
      title: 'New Title',
      content: 'Updated Content'
    });
    console.log('Result:', updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  }
  catch (e) {
    console.error("Error testing database!");
    throw e;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());