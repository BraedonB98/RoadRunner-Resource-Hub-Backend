const mongoose = require('mongoose');
const { connectToDatabase } = require('../connection/db-conn');
const { redis_client } = require('../connection/redis-conn');
const { v4: uuidv4 } = require('uuid');
const url = `${process.env.MongoDB_URL}/?retryWrites=true&w=majority`;
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