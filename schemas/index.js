const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb+srv://ayam:<password>@cluster0.chzg4j4.mongodb.net/?retryWrites=true&w=majority")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("MongoDB connection error", err);
});

module.exports = connect;