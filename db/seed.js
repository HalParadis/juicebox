const { 
  client, 
  getAllUsers,
  createUser,
  updateUser
} = require('./index');

const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
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

const rebuildDB = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
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
    //console.log('users[0].id:', users[0].id);
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

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