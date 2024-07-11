const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/client/cart.controller"); // import từ file tên là home.controller.js

router.get("/", controller.index);

router.post('/add/:productId', controller.addPost); // từ hàm controller gọi đến hàm index

router.get('/delete/:productId', controller.delete);

module.exports = router; 