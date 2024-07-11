const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");



// [GET] /checkout/
module.exports.index = async (req, res) => {

    const cartId = req.cookies.cartId;
    
    const cart = await Cart.findOne({
        _id: cartId
    });

    if(cart.products.length > 0){
        for (const item of cart.products) {
            const productId = item.product_id;

            const productInfo = await Product.findOne({
                _id: productId
            });

            productInfo.priceNew = productsHelper.priceNewProduct1(productInfo);

            item.productInfo = productInfo;

            item.totalPrice = item.quantity * productInfo.priceNew;
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0); // tổng tiền của cả giỏ hàng

    res.render("client/pages/checkout/index.pug", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
};

//[POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;// lấy ra thông tin của người dùng đã nhập vào 3 ô input

    const cart = await Cart.findOne({
        _id: cartId // lấy ra được thông tin của giỏ hàng
    });

    let products = [];

    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };

        const productInfo = await Product.findOne({
            _id: product.product_id
        });

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct);
    }
    const objectOrder = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            products: [] // vì đã mua hàng nên cập nhật lại thành mảng rỗng
        }
    );

    res.redirect(`/checkout/success/${order.id}`);

}