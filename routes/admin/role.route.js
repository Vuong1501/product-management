const express = require('express');
const router = express.Router(); 

const controller = require("../../controllers/admin/role.controller"); // import từ file tên là home.controller.js
router.get('/', controller.index); // từ hàm controller gọi đến hàm index

router.get('/create', controller.create);

router.post('/create', controller.createPost);


module.exports = router; 