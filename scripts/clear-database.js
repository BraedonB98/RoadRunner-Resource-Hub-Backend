//------------------Mongo------------------------
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

console.log(`Clearing Database - ${process.env.MongoDB_AppName}`);
// Set the strictQuery option to false to prepare for Mongoose 7
mongoose.set("strictQuery", false);

mongoose
  .connect(`mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Password}@${process.env.MongoDB_Server}/?retryWrites=true&w=majority&appName=${process.env.MongoDB_AppName}`)
  .then(async () => {
    console.log("Connected to database");

    console.log("-------------------------------Clearing all Collections---------------------------------");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (let collection of collections) {
      console.log(`Clearing collection: ${collection.name}`);
      await db.collection(collection.name).deleteMany({});
      console.log(`Cleared collection: ${collection.name}`);
    }
    console.log("All collections cleared");

    // Close the connection after clearing the collections
    mongoose.connection.close();

    // Function to clear files in a directory except for specified files
    function clearFiles(directory, exceptions) {
      console.log(`---------------------------------------Clearing files in directory-------------------------------- `);
      console.log(`Exceptions: ${exceptions}`);
      console.log(`Directory: ${directory}`);
      fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          if (!exceptions.includes(file)) {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) throw err;
              console.log(`Deleted file: ${file}`);
            });
          }
        }
      });
    }

    // Clear files in the specified directories
    clearFiles(path.join(__dirname, "./../data/uploads/images"), ["default.svg"]);
    clearFiles(path.join(__dirname, "./../data/uploads/resourceImages"), ["DefaultResourceImage.jpg"]);

    mongoose.connection.close(() => {
      console.log("Mongoose connection disconnected");
      process.exit(0);
    });
  })
  .catch((error) => {
    console.log(error);
    mongoose.connection.close(() => {
      console.log("Mongoose connection disconnected");
      process.exit(1);
    });
  });
