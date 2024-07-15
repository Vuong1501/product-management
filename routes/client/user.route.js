const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/client/user.controller"); // import từ file tên là home.controller.js
const validate = require("../../validates/client/user.validate");

// router.get('/', controller.index); // từ hàm controller gọi đến hàm index

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

module.exports = router; 