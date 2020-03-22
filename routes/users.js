const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersInRadius
} = require("../controllers/users");

//Include other resourse router
const courseRouter = require("./products");

const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
