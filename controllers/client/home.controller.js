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

    const newProductsFeatured  = productsHelper.priceNewProduct(productsFeatured);

    // hết phần lấy ra sản phẩm nổi bật

    // Lấy ra những sản phẩm mới nhất

    const productsNew = await Product.find({
        deleted: false,
        status: "active",

    }).sort({position: "desc"}).limit(6);
    const newProductsNew = productsHelper.priceNewProduct(productsNew);


    // hết phần lấy ra những sản phẩm mới nhất


    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured ,
        productsNew: newProductsNew
    });
};