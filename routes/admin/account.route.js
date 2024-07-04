const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/account.controller"); // import từ file tên là home.controller.js
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware1");
const validate = require("../../validates/admin/account.validate");

router.get('/', controller.index); // từ hàm controller gọi đến hàm index
router.get('/create', controller.create);
router.post(
    '/create', 
    upload.single("avatar"),
    //uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.get('/edit/:id', controller.edit);
router.patch(
    '/edit/:id', 
    upload.single("avatar"),
    //uploadCloud.upload,
    validate.editPatch,
    controller.editPatch
);


module.exports = router; 