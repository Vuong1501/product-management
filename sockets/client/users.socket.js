const User = require("../../models/user.model");

module.exports = async (res) => {

    _io.once("connection", (socket) => {
        //NGƯỜI DÙNG GỬI YÊU CẦU KẾT BẠN
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

        //NGƯỜI DÙNG HỦY GỬI YÊU CẦU KẾT BẠN
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;//đây là id của A

            // xóa id của A trong accpetFriends của B
            const existUserAinB = await User.findOne({
                _id: userId, // tìm ra id của B trước
                acceptFriends: myUserId // sau đó xem trong B đã tồn tại A chưa
            });

            if(existUserAinB){ // nếu tồn tại id của A trong accpetFriends thì mới xóa
                await User.updateOne({
                    _id: userId // vế 1 là điều kiện. Để tìm ra id của của B
                }, {
                    $pull: {acceptFriends: myUserId} // xóa id của A trong accept của B
                });
            }


            // xóa id của B trong requestFriends của A

            const existUserBinA = await User.findOne({
                _id: myUserId, // tìm ra id của A trước
                requestFriends: userId // sau đó xem trong A đã tồn tại B chưa
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: myUserId // vế 1 là điều kiện. Để tìm ra id của A
                }, {
                    $pull: {requestFriends: userId} // xóa id của B trong request của A
                });
            }
            // console.log(myUserId); // id của A
            // console.log(userId); //id của B
        });

        //NGƯỜI DÙNG TỪ CHỐI YÊU CẦU KẾT BẠN
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;//đây là id của B

            // xóa id của A trong accpetFriends của B
            const existUserAinB = await User.findOne({
                _id: myUserId, // tìm ra id của B trước
                acceptFriends: userId // xóa đi id của A trong accept friend của B
            });

            if(existUserAinB){ // nếu tồn tại id của A trong accpetFriends thì mới xóa
                await User.updateOne({
                    _id: myUserId // vế 1 là điều kiện. Để tìm ra id của của B
                }, {
                    $pull: {acceptFriends: userId} // xóa id của A trong accept của B
                });
            }

            // xóa id của B trong requestFriends của A

            const existUserBinA = await User.findOne({
                _id: userId, // tìm ra id của A trước
                requestFriends: myUserId // sau đó xem trong A đã tồn tại B chưa
            });

            if(existUserBinA){
                await User.updateOne({
                    _id: userId // vế 1 là điều kiện. Để tìm ra id của A
                }, {
                    $pull: {requestFriends: myUserId} // xóa id của B trong request của A
                });
            }
            // console.log(myUserId); // id của B
            // console.log(userId); //id của A
        });

    });
}