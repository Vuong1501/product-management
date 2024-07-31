const { findOne } = require("../../models/product-category.model");
const User = require("../../models/user.model");

//[GET]/users/not-friend
module.exports.notFriend =  async (req, res) => { 

    const userId = res.locals.user.id;// lấy ra id của người đã đăng nhập vào

    const users = await User.find({ // lấy ra danh sách các người đã gửi
        _id: { $ne: userId},// lấy ra trừ tài khoản đã đăng nhập
        status: "active",
        deleted: false
    }).select("avatar fullName");

    console.log(users);





    res.render("client/pages/users/not-friend.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
};