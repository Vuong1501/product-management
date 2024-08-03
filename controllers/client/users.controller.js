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


//[GET]/users/request
module.exports.request = async (req, res) => {
    
    // Socket

    usersSocket(res);

    // End Socket

    const userId = res.locals.user.id;// lấy ra id của người đã đăng nhập vào
    const myUser = await User.findOne({
        _id: userId
    }); // Lấy ra thông tin của A

    const requestFriends = myUser.requestFriends;//lấy ra những người mà A gửi kết bạn đi
    const users = await User.find({
        _id: {$in: requestFriends}, // lấy ra những người có trong danh sách mình đã gửi yêu cầu đi
        status: "active",
        deleted: false
    }).select("id avatar fullName");
    

    res.render("client/pages/users/request.pug", {
        pageTitle: "Lời mời đã gửi",
        users: users
    });
};

//[GET]/users/accept
module.exports.accept = async (req, res) => {
    
    // Socket

    usersSocket(res);

    // End Socket

    const userId = res.locals.user.id;// lấy ra id của người đã đăng nhập vào
    const myUser = await User.findOne({
        _id: userId
    }); // Lấy ra thông tin của người đã đăng nhập vào

    const acceptFriends = myUser.acceptFriends;//lấy ra những người mà đã gửi kết bạn 
    const users = await User.find({
        _id: {$in: acceptFriends}, // lấy ra những người có trong danh sách đã gửi yêu cầu kết bạn cho mình
        status: "active",
        deleted: false
    }).select("id avatar fullName");
    

    res.render("client/pages/users/accept.pug", {
        pageTitle: "Lời mời đã nhận",
        users: users
    });
};

//[GET]/users/friends
module.exports.friends = async (req, res) => {
    
    // Socket

    usersSocket(res);

    // End Socket

    const userId = res.locals.user.id;// lấy ra id của người đã đăng nhập vào
    const myUser = await User.findOne({
        _id: userId
    }); // Lấy ra thông tin của người đã đăng nhập vào

    const friendList = myUser.friendList;//lấy ra những danh sách bạn bè
    const friendListId = friendList.map(item => item.user_id);// vì từ khóa in chỉ lấy ra String mà khi friendList là object nên chỉ lấy id của object
    const users = await User.find({
        _id: {$in: friendListId}, // lấy ra những người có trong danh sách  bạn bè
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline");
    

    res.render("client/pages/users/friends.pug", {
        pageTitle: "Danh sách bạn bè",
        users: users
    });
};
