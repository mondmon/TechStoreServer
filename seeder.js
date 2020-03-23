const fs = require("fs");

const mongoose = require("mongoose");

const colors = require("colors");

const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load Models
const Product = require("./models/Product");
//Connect to DB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

console.log(`DB CONNECTED`.blue.bold.inverse);
//Read JSON files

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, "utf-8")
);

//Import into DB
const importData = async () => {
  try {
    await Product.create(products);

    console.log(`Data Imported...`.green.inverse.bold);
    process.exit();
  } catch (err) {
    console.log(`${err}`.red);
  }
};

//Destroy Data
const deleteData = async () => {
  try {
    await Product.deleteMany();

    console.log(`Data Destroyed...`.red.inverse.bold);
    process.exit();
  } catch (err) {
    console.log(`${err}`.red);
  }
};

//Add arguement to specify the command to be excuted
if (process.argv[2] !== "-import" && process.argv[2] !== "-destroy") {
  console.log(
    `you entered ${process.argv[2]}, you need to use either -import to import the data or -destroy to delete data, please exit and try again`
      .red.bold
  );
} else {
  if (process.argv[2] === "-import") {
    importData();
  } else if (process.argv[2] === "-destroy") {
    deleteData();
  }
}
