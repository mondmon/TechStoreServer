const ErrorResponse = require("../utils/errorResponse");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const asyncHandler = require("../middleware/async");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const { User, validate } = require("../models/User");

//@Desc Get All users
//@route  GET /api/v1/users
//@route  GET /api/v1/users
//@access Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorResponse(`No users found`, 404));
  }
  res.status(200).json({ success: true, count: users.length, data: users });
});

//@Desc   Get Single user
//@route  GET /api/v1/:id
//@access Public
exports.getUser = asyncHandler(validateObjectId, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`There is no user with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: user });
});

//@Desc   Add User
//@route  POST /api/v1/users
//@access Private
exports.createUser = asyncHandler(admin, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (await User.findOne({ username: req.body.username })) {
    return next(new ErrorResponse(`User name already existed`, 400));
  }

  req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  const user = new User({
    username: req.body.username,
    password: req.body.password,
    avatar: req.body.avatar,
    role: req.body.role
  });

  await user.save();
  res.status(201).json({ success: true, data: user });
});

//@Desc    Update user
//@route  PUT /api/v1/:id
//@access Private
exports.updateUser = asyncHandler(validateObjectId, async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`No user with the id of ${req.params.id}`, 404)
    );
  }

  if (req.user.id != user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(`You must be an admin to edit another user`, 403)
    );
  }

  const { error } = validate(req.body);

  if (error) {
    return next(new ErrorResponse(`${error.details[0]}`, 400));
  }

  if (
    await User.findOne({
      username: req.body.username,
      _id: { $ne: req.params.id }
    })
  ) {
    return next(new ErrorResponse(`Username alreay registered`, 400));
  }

  req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      password: req.body.password,
      avatar: req.body.avatar,
      role: req.body.role
    },
    { new: true }
  );

  res.status(200).json({ success: true, data: user });
});

//@Desc    Delete User
//@route  DELETE /api/v1/:id
//@access Private
exports.deleteUser = asyncHandler(
  [admin, validateObjectId],
  async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(
        new ErrorResponse(
          `There is No user with the id of ${req.params.id}`,
          400
        )
      );
    }
    res.status(200).json({ success: true, data: {} });
  }
);
