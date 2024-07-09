// tách trang này ra nếu bên home.route.js cần dùng đến thì import vào
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index =  async (req, res) => { 
    // phần lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);

    const newProducts = productsHelper.priceNewProduct(productsFeatured);

    //console.log(productsFeatured);
    // hết phần lấy ra sản phẩm nổi bật


    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts
    });
};