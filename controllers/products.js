const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@Desc Get All Products
//@route  GET /api/v1/products
//@access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  //Remove certain fields
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators($gt, $gte, lt, lte, in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //Finding resourse
  query = Product.find(JSON.parse(queryStr));

  //SELECT Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").joint(" ");
    query = query.select(fields);
  }

  //SORT Fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").joint(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endEndex = page * limit;
  const total = await Product.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Excuting resourse
  const products = await query;

  //Pagination result
  const pagination = {};
  if (endEndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

// GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET

//@Desc Get Single Product
//@route  GET /api/v1/products/:id
//@access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with an id of ${res.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: product });
});

// POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST POST

//@Desc Create new Product
//@route  POST /api/v1/products
//@access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

//@Desc Update new Product
//@route  PUT /api/v1/products/:id
//@access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    //To get the new data in the response
    new: true,
    runValidator: true
  });
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with an id of ${res.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: product });
});

//@Desc Delete Product
//@route  DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with an id of ${res.params.id}`, 404)
    );
  }

  product.remove();
  res.status(200).json({ success: true, data: {} });
});
