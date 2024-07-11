const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /cart/
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

    res.render("client/pages/cart/index.pug", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}


// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity); //chuyển sang dạng Number để giống trong DB

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProductInCart = cart.products.find( item => item.product_id == productId) //productId là người dùng gửi lên, product_id là trong DB

    if(existProductInCart){ // Nếu đã có sản phẩm đó teong giỏ hàng thì chỉ cần cập nhật sô lượng sản phẩm đó thôi
        const newQuantity = quantity + existProductInCart.quantity; // số lượng mới bằng số lượng người ta gửi lên + với số lượng hiện có trong DB

        await Cart.updateOne(
            {
                _id: cartId, // trùng id của giỏ hàng
                'products.product_id': productId, // product là mảng product trong DB, product_id là id của sản phẩm đó, productId là số lượng sản phẩm người dùng gửi lên
            },
            {//update lại số lượng sau khi thêm
                'products.$.quantity': newQuantity
            }
        )
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
    
        await Cart.updateOne(
            {
                _id: cartId, // id trùng với id của giỏ hàng để biết là thêm vào giỏ hàng nào
            },
            {
                $push: {products : objectCart} // push thêm key product vào objectCart(Vì chỗ model là 1 mảng)
            }
        );

    }
    req.flash("success", "Bạn đã thêm sản phẩm vào giỏ hàng thành công!");
    
    res.redirect("back");
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {

    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    
    await Cart.updateOne(
        {
            _id: cartId // tìm vào cái giỏ hàng mà muốn xóa
        },
        {
            "$pull": {products: {"product_id": productId}}
        }
    );

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
    res.redirect("back");
}


// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {

    const cartId = req.cookies.cartId; // lấy ra giỏ hàng cần update
    const productId = req.params.productId;
    const quantity = req.params.quantity; // số lượng của sản phẩm cần update
    
    await Cart.updateOne(
        {
            _id: cartId, // trùng id của giỏ hàng
            'products.product_id': productId // product là mảng product trong DB, product_id là id của sản phẩm đó, productId là số lượng sản phẩm người dùng gửi lên
        },
        { //update lại số lượng sau khi thêm
            'products.$.quantity': quantity // cập nhật lại quantity trong giỏ hàng bằng cái quantity người dùng đã gửi lên(quantity thứ 2)
        }
    );

    req.flash("success", "Đã cập nhật số lượng");
    res.redirect("back");
}