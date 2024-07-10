const Cart = require("../../models/cart.model");


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