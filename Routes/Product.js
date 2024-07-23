const express = require("express");
const router = express.Router();

const {addProduct , deleteProduct  ,editProduct , addToCart , addToWishlist ,removeFromCart,removeFromWishlist , fetchProductsForAll , fetchProductsBrand , fetchCart,fetchWishlist, fetchOrders , addOrder, fetchReceivedOrders } = require("../Controllers/Product.js")

router.post("/addProduct" , addProduct);
router.post("/deleteProduct/:id", deleteProduct);
router.post("/editProduct/:id",editProduct);
router.post("/addToCart/:id" , addToCart);
router.post("/removeFromCart/:id" , removeFromCart);
router.post("/addToWishlist/:id" , addToWishlist);
router.post("/addToOrders/:id" , addOrder);
router.post("/removeFromWishlist/:id" , removeFromWishlist);
router.get("/fetchProductsForAll",fetchProductsForAll);
router.get("/fetchProductsBrand/:id" ,fetchProductsBrand);
router.get("/fetchCart/:userid" , fetchCart);
router.get("/fetchWishlist/:userid" , fetchWishlist);
router.get("/fetchOrders/:userid" , fetchOrders);
router.get("/fetchReceivedOrders/:userid" , fetchReceivedOrders);



exports.router = router;