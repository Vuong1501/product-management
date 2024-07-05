const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/admin/auth.controller"); // import từ file tên là home.controller.js
const validate = require("../../validates/admin/auth.validate")

router.get('/login', controller.login); // từ hàm controller gọi đến hàm index
router.post(
    '/login',
    validate.loginPost,
    controller.loginPost
);

router.get('/logout', controller.logout);


module.exports = router; 