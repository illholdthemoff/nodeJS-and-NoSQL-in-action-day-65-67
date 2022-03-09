const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database; // created outside of connect function so it can be used outside of it, and in the project in general.

async function connect() {
  const client = await MongoClient.connect("mongodb://0.0.0.0:27017"); //the address being used by the mongo on our system. ALSO returns a promise btw, if you hover over connect
  database = client.db("blog"); // db is a method used to connect to a specific database on the server, in this case the blog database.
}

function getDb() {
  if (!database) {
    throw { message: "Database connection not established!" };
  }
  return database;
}

module.exports = {
  //this just allows us to export the connect and getdb functions to other parts of the project
  connectToDatabase: connect,
  getDb: getDb,
};
