import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value; // lấy ra tin nhắn vừa gửi

        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content) // gửi lên sự kiện tên là CLIENT_SEND_MESSAGE với nội dung là content
            e.target.elements.content.value = ""; // gán lại ô input sang rỗng
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}

// END CLIENT_SEND_MASSAGE


// SERVER_RETURN_MESSAGE

socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body"); // lấy ra thẻ body
    const boxTyping = document.querySelector(".inner-list-typing");

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
    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight; // để mỗi lần gửi tin nhắn thì tin nhắn sẽ ở dưới luôn mà không cần phải cuộn xuống
});


// END SERVER_RETURN_MESSAGE

// Khi mới vào thì tin nhắn sẽ ở dưới cùng

const bodyChat = document.querySelector(".chat .inner-body"); // lấy ra thẻ body chat
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight; // chiều cao đúng bằng chiều cao của khung chat
}

// Hết phần khi mới vào thì tin nhắn sẽ ở dưới cùng

// Show typing 
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}


// End Show typing 

//emoji-picker
// Show icon
const buttonIcon = document.querySelector(".button-icon"); 
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });
}
// insert icon

const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker){

    const inputChat = document.querySelector(".chat .inner-form input[name='content']");//lấy ra ô tin nhắn để chèn được icon vào ô đó

    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon; // để khi đang nhắn tin mà chọn thêm icon thì không bị mất tin nhắn đang viết trước đó
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();
        showTyping();
        
    });

    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
}

//end emoji-picker


// SERVER_RETURN_TYPING
const elementsListTyping = document.querySelector(".chat .inner-list-typing");
if(elementsListTyping){
    socket.on("SERVER_RETURN_TYPING", (data) =>{
        if(data.type == "show"){
            const existTyping = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementsListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if(boxTypingRemove){
                elementsListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}



//END SERVER_RETURN_TYPING