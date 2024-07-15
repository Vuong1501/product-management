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

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {

    // console.log(req.params.orderId);

    // lấy ra đơn hàng đã đặt
    const order = await Order.findOne({
        _id: req.params.orderId
    });

    // lặp qua từng phần tử trong mảng product
    for (const product of order.products) {
        // lấy ra thông tin của sản phẩm đó
        const productInfo = await Product.findOne({
            _id: product.product_id // product là phần tử trong mảng product nên khi product.product_id  sẽ lấy ra id của sản phẩm đó
        }).select(" title thumbnail");
        product.productInfo = productInfo; // add thêm 1 key productInfo vào object product, vì mỗi product là 1 object trong mảng products

        // Tính ra giá mới của mỗi sản phẩm 
        product.priceNew = productsHelper.priceNewProduct1(product);

        // tổng giá của sản phẩm đó với số lượng là x
        product.totalPrice = product.priceNew * product.quantity;
    }

    //Giá của tổng đơn hàng
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });
}