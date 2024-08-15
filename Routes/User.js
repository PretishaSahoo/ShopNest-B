const express = require("express");

const { fetchUserById, createUser,editUser, loginUser, fetchUserByEmail } = require("../Controllers/User");
const {getTrends} = require("../Controllers/FetchTrends");

const router = express.Router();

router.post("/fetchuser" , fetchUserByEmail)
router.post("/signup" , createUser)
router.post("/login",loginUser)
router.post("/editUser/:email" , editUser)
router.post("/fetchTrends/:query" ,getTrends  );

exports.router = router;
   