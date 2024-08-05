
const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;// lấy ra id của người đã gửi tin nhắn
    const fullName = res.locals.user.fullName;// lấy ra tên của người đã gửi tin nhắn
    const roomChatId = req.params.roomChatId;//lấy ra id của phong chat

    _io.once('connection', (socket) => {
        socket.join(roomChatId); // để gom những user có chung id thành 1 phòng chat
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {

            let images = [];
            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer);
                images.push(link);
            }

            //Lưu tin nhắn và người gửi vào DB
            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId ,
                content: data.content,
                images: images
            });
            await chat.save();

            // Trả data về cho client
            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
    });
}