const mongoose = require("mongoose");

// define schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quote: { type: String },
  },
  { collection: "user-data" }
);

// define model
const model = mongoose.model("UserData", userSchema);

module.exports = model;

/*
----------- SCHEMA
shape of data
each schema maps to a MongoDB collection & defines the shape of the documentes within the collection
----------- MODEL
responsible for creating and reading documents from the mongoDB.
to use the defined schema, we need to convert the schema into a model (mongoose.model(modelName, schema))
by default, mongoose adds an _id property to schema
an instance of a model is called document.
The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. 
Thus, for the example above, the model User is for the users collection in the database.
*/
