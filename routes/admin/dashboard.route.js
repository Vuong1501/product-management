const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/admin/dashboard.controller"); // import từ file tên là home.controller.js
router.get('/', controller.dashboard); // từ hàm controller gọi đến hàm index

module.exports = router; 