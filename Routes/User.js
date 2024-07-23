const express = require("express");

const { fetchUserById, createUser,editUser, loginUser, fetchUserByEmail } = require("../Controllers/User");

const router = express.Router();

router.post("/fetchuser" , fetchUserByEmail)
router.post("/signup" , createUser)
router.post("/login",loginUser)
router.post("/editUser/:email" , editUser)

exports.router = router;
   