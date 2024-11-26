const { MongoClient } = require('mongodb');

const deleteTestDatabases = async () => {
  const url = `mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Password}@${process.env.MongoDB_Server}/?retryWrites=true&w=majority&appName=${process.env.MongoDB_AppName}`;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const databaseNames = await client.db().admin().listDatabases();
    const testDatabaseNames = databaseNames.databases.filter(db => db.name.startsWith('test_'));

    for (const database of testDatabaseNames) {
      await client.db(database.name).dropDatabase();
      console.log(`Deleted database: ${database.name}`);
    }
  } catch (error) {
    console.error('Error deleting test databases:', error);
  } finally {
    await client.close();
  }
};

deleteTestDatabases(); 
