const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFavouriteProducts,
  addFavouriteProduct,
  removeFromFavourites,
  addToCart,
  getCartItems,
} = require("../controllers/products");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getProducts)
  .post(createProduct);

router
  .route("/favourites/:userId/productId")
  .get(getFavouriteProducts)
  .post(addFavouriteProduct)
  .delete(removeFromFavourites);

  router
  .route("/cart/:userId/productId")
  .get(getCartItems)
  .post(addToCart)
  .delete(removeFromCart);

router
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
