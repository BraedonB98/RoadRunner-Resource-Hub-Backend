const { MongoClient } = require('mongodb');

const deleteTestDatabases = async () => {
  const url = `${process.env.MongoDB_URL}/?retryWrites=true&w=majority`;
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
