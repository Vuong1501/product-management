// Chức năng gửi yêu cầu

const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add"); // closet dùng để lấy ra box cha và sau đó add thêm class ad để khi ấn vào chữ kết bạn thì chữ kết bạn sẽ ẩn đi
            const userId = button.getAttribute("btn-add-friend"); // lấy ra thuộc tính của btn-add-friend tức là id của người gửi kết bạn

            socket.emit("CLIENT_ADD_FRIEND", userId);//gửi lên server id của người gửi kết bạn
        });


        
        
    });
}

// Hết phần chức năng gửi yêu cầu