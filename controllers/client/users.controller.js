// const { findOne } = require("../../models/product-category.model");
const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

//[GET]/users/not-friend
module.exports.notFriend =  async (req, res) => { 

    // Socket

    usersSocket(res);

    // End Socket

    
    const userId = res.locals.user.id;// lấy ra id của người đã đăng nhập vào
    const myUser = await User.findOne({
        _id: userId
    });// lấy ra id của người gửi
    const requestFriends = myUser.requestFriends;//lấy ra 1 mảng những người mà mình đã gửi yêu cầu
    const acceptFriends = myUser.acceptFriends; // lấy ra 1 mảng những người nằm danh sách sách đã gửi kết bạn cho mình



    const users = await User.find({ // lấy ra danh sách các người đã gửi
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } }
        ],// để lấy ra trừ các tài khoản đã đăng nhập và 1 mảng những người không nằm trong mảng requestFriends
        // _id: { $ne: userId},// lấy ra trừ tài khoản đã đăng nhập
        // _id: {$nin: requestFriends}, // lấy ra 1 mảng những người không nằm trong mảng requestFriends
        status: "active",
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/not-friend.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
};