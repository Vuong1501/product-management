// ĐÂY ĐƯỢC COI LÀ TRANG CHỦ CỦA PRODUCT
const express = require('express');
const router = express.Router(); // vì express có hàm Route nên khi tách route từ những product ta dùng express

const controller = require("../../controllers/client/product.controller");// import từ file tên là product.controller.js

router.get('/', controller.index);// chỉ cần / thôi vì đây là trang chủ của trang product, mai sau sẽ có thêm /edit, /delete,...
                                //  từ hàm controller gọi đến hàm index
router.get('/:slugCategory', controller.category);

router.get('/detail/:slugProduct', controller.detail);
module.exports = router; // phải export để những nơi khác có thể dùng, nơi nào cần dùng thì require("./product.route") vào là có thể dùng được