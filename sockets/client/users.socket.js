const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

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

            // lấy độ dài acceptFriends của B để trả cho B
            const infoUserB = await User.findOne({
                _id: userId
            });

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            //trả về client
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId, // chỉ tra về cho B
                lengthAcceptFriends: lengthAcceptFriends
            });

            // lấy thông tin của A trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId, // id của A
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId, // chỉ tra về cho B
                infoUserA: infoUserA
            });
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

            // lấy độ dài acceptFriends của B để trả cho B
            const infoUserB = await User.findOne({
                _id: userId
            });

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            //trả về client
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId, // chỉ tra về cho B
                lengthAcceptFriends: lengthAcceptFriends
            });

            //lấy id của A trả về cho B để B biết là A vừa hủy gửi yêu cầu
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId, // trả về Id của B để biết là A vừa hủy yêu cầu B
                userIdA: myUserId // id của A
            });
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

        //NGƯỜI DÙNG CHẤP NHẬN YÊU CẦU KẾT BẠN
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;//đây là id của B
            // Lấy ra user đã tồn tại
            const existUserAinB = await User.findOne({
                _id: myUserId, // tìm ra id của B trước
                acceptFriends: userId // xóa đi id của A trong accept friend của B
            });

            const existUserBinA = await User.findOne({
                _id: userId, // tìm ra id của A trước
                requestFriends: myUserId // sau đó xem trong A đã tồn tại B chưa
            });

            let roomChat;
            // Tạo phòng chat
            if(existUserAinB && existUserBinA){
                roomChat = new RoomChat({
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ],
                });
                await roomChat.save();
            }

            // -Thêm userId của A vào listfriend của B
            // xóa id của A trong accpetFriends của B
            

            if(existUserAinB){ // nếu tồn tại id của A trong accpetFriends thì mới xóa
                await User.updateOne({
                    _id: myUserId // vế 1 là điều kiện. Để tìm ra id của của B
                }, {
                    // vừa xóa vừa thêm
                    $push: {
                        friendList: {
                            user_id: userId,// id của A
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {acceptFriends: userId} // xóa id của A trong accept của B
                });
            }

            // -Thêm userId của B vào listfriend của A
            // xóa id của B trong requestFriends của A

            if(existUserBinA){
                await User.updateOne({
                    _id: userId // vế 1 là điều kiện. Để tìm ra id của A
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,// id của B
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {requestFriends: myUserId} // xóa id của B trong request của A
                });
            }
            // console.log(myUserId); // id của B
            // console.log(userId); //id của A
        });

    });
}