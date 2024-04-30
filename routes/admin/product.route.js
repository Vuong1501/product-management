const express = require('express');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const router = express.Router();
// cloudinary
cloudinary.config({
    cloud_name: 'dcnwcdqip',
    api_key: '468433732893986',
    api_secret: 'CO3XCGK4CogVygfaJ0SMADPMsT8'
});
//  end cloudinary
const upload = multer();

const controller = require("../../controllers/admin/product.controller"); // import từ file tên là home.controller.js
const validate = require("../../validates/admin/product.validate");
router.get('/', controller.index); // từ hàm controller gọi đến hàm index
router.patch('/change-status/:status/:id', controller.changeStatus);// dấu : để chuyền data động(có thể là inactive hoặc active do người dùng gửi lên)
// :id là id của sản phẩm
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id', controller.deleteItem);
router.get('/create', controller.create);
router.post(
    '/create',
    upload.single("thumbnail"),
    function (req, res, next) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result.secure_url);
            req.body[req.file.fieldname] = result.secure_url;
        }

        upload(req);
        next();
    },
    validate.createPost,
    controller.createPost
);
router.get('/edit/:id', controller.edit);
router.patch(
    '/edit/:id',
    upload.single("thumbnail"),
    validate.createPost,
    controller.editPatch
);
router.get('/detail/:id', controller.detail);

module.exports = router; 