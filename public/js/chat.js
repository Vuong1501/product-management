// CLIENT_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value; // lấy ra tin nhắn vừa gửi

        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content) // gửi lên sự kiện tên là CLIENT_SEND_MESSAGE với nội dung là content
            e.target.elements.content.value = ""; // gán lại ô input sang rỗng
        }
    });
}

// END CLIENT_SEND_MASSAGE