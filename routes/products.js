const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/products");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getProducts)
  .post(createProduct);

router
  .route("/favourites/:userId/productId")
  .get(getFavouriteProducts)
  .post(addFavouriteProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
