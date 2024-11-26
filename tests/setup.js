const mongoose = require('mongoose');
const { connectToDatabase } = require('../connection/db-conn');
const { redis_client } = require('../connection/redis-conn');
const { v4: uuidv4 } = require('uuid');
const url = `mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Password}@${process.env.MongoDB_Server}/?retryWrites=true&w=majority&appName=${process.env.MongoDB_AppName}`;
const setup = () => {
  beforeEach(async () => {
    await connectToDatabase(`${url}`);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await redis_client.flushDb();
  });
};

module.exports = { setup }; 