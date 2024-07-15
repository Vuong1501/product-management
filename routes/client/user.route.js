const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/client/user.controller"); // import từ file tên là home.controller.js
const validate = require("../../validates/client/user.validate");
// router.get('/', controller.index); // từ hàm controller gọi đến hàm index

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

module.exports = router; 