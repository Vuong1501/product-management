const User = require("../../models/user.model");

module.exports = async (res) => {

    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Thêm được id của A vào accept của B
            const existUserAinB = await User.findOne({
                _id: userId, // tìm ra id của B trước
                acceptFriends: myUserId // sau đó xem trong B đã tồn tại A chưa
            });

            if(!existUserAinB){
                await User.updateOne({
                    _id: userId // vế 1 là điều kiện. Để tìm ra id của của B
                }, {
                    $push: {acceptFriends: myUserId} // thêm id của A vào accpet của B
                });
            }


            // Thêm được id của B vào request của A

            const existUserBinA = await User.findOne({
                _id: myUserId, // tìm ra id của A trước
                requestFriends: userId // sau đó xem trong A đã tồn tại B chưa
            });

            if(!existUserBinA){
                await User.updateOne({
                    _id: myUserId // vế 1 là điều kiện. Để tìm ra id của A
                }, {
                    $push: {requestFriends: userId} // thêm id của B vào request của A
                });
            }


            // console.log(myUserId); // id của A
            // console.log(userId); //id của B
        });
    });
}