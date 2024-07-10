const Cart = require("../../models/cart.model");


module.exports.cartId = async (req, res, next) => {
   
    if(!req.cookies.cartId){
        //khi chưa có giỏ hàng
        const cart = new Cart(); //tạo 1 giỏ hàng mới vì lần đầu người ta vào
        await cart.save();


        const expiresTime = 1000 * 60 * 60 * 24 * 365; // ngày hết hạn là 1 năm sau khi khởi tạo
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });// để trong phần cookies có thêm key là cartId và value là id của giỏ hàng
    } else{
        //khi đã có giỏ hàng
    }

    next();
}