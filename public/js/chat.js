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


// SERVER_RETURN_MESSAGE

socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body"); // lấy ra thẻ body

    const div = document.createElement("div");    //add thêm 1 thẻ div

    let htmlFullName = "";

    if(myId == data.userId){ // nếu là cùng 1 người thì sẽ ẩn tên
        div.classList.add("inner-outgoing");//add thêm class inner-coming vào thể div đó
    } else { // khác nhau sẽ hiện tên
        div.classList.add("inner-incoming");//add thêm class inner-coming vào thể div đó
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div> 
    `; // thêm 2 thẻ div vào trong thẻ div vừa thêm ở trên
    body.appendChild(div);
});


// END SERVER_RETURN_MESSAGE