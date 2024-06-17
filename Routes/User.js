const express = require("express");

const { fetchUserById, createUser,editUser, loginUser } = require("../Controllers/User");

const router = express.Router();

router.get("/fetchuser/:id" , fetchUserById)
router.post("/signup" , createUser)
router.post("/login",loginUser)
router.post("/editUser/:id" , editUser)

exports.router = router;
