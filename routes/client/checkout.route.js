const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/client/checkout.controller"); // import từ file tên là home.controller.js

router.get('/', controller.index); // từ hàm controller gọi đến hàm index

router.post('/order', controller.order);

router.get('/success/:orderId', controller.success);

module.exports = router; 