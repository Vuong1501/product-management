const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/product.controller"); // import từ file tên là home.controller.js
const validate = require("../../validates/admin/product.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware1");

router.get('/', controller.index); // từ hàm controller gọi đến hàm index
router.patch('/change-status/:status/:id', controller.changeStatus);// dấu : để chuyền data động(có thể là inactive hoặc active do người dùng gửi lên)
// :id là id của sản phẩm
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);
router.post(
    '/create',
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.get('/edit/:id', controller.edit);
router.patch(
    '/edit/:id',
    upload.single("thumbnail"),
    // uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);
router.get('/detail/:id', controller.detail);

module.exports = router; 