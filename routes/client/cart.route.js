const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/client/cart.controller"); // import từ file tên là home.controller.js
router.post('/add/:productId', controller.addPost); // từ hàm controller gọi đến hàm index

module.exports = router; 