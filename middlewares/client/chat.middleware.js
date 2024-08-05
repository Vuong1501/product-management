const RoomChat = require("../../models/room-chat.model");
// xem id đó có được phép truy cập vào đoạn chat hay không
module.exports.isAccess = async (req, res, next) => {
    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;

    try {
        const isAccessRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": userId,//đi tìm vào key user và tìm các object đó và tìm các key tên là user_id
            deleted: false
        });
    
        if(isAccessRoomChat){
            next();
        } else{
            res.redirect("/");
        }
    } catch (error) {
        res.redirect("/");
    }
    
}