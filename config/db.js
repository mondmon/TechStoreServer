const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(
    `Mongodb connected: ${connection.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
