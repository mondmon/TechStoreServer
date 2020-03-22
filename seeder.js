const fs = require("fs");

const mongoose = require("mongoose");

const colors = require("colors");

const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config" });

//Load Models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

const MONGURI =
  "mongodb://umkemcnmixvfnwuwyalq:vIHhTtYdVGhDIqN3lEys@bkfxjex1lhxu5w7-mongodb.services.clever-cloud.com:27017/bkfxjex1lhxu5w7";

//Connect to DB

mongoose.connect(MONGURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

console.log(`DB CONNECTED`.blue.bold.inverse);
//Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

//Read JSON files
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

//Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);

    console.log(`Data Imported...`.green.inverse.bold);
    process.exit();
  } catch (err) {
    console.log(err.red);
  }
};

//Destroy Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log(`Data Destroyed...`.red.inverse.bold);
    process.exit();
  } catch (err) {
    console.log(err.red);
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
