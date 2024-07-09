const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/client/search.controller"); // import từ file tên là home.controller.js
router.get('/', controller.index); // từ hàm controller gọi đến hàm index

module.exports = router; 