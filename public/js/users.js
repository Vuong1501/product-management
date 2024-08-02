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

//Chức năng hủy gửi yêu cầu kết bạn

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add"); // closet dùng để lấy ra box cha và sau đó xóa class ad để khi ấn vào chữ hủy thì chữ kết bạn sẽ hiển lên
            const userId = button.getAttribute("btn-cancel-friend"); // lấy ra thuộc tính của btn-add-friend tức là id của người gửi kết bạn

            socket.emit("CLIENT_CANCEL_FRIEND", userId);//gửi lên server id của người gửi kết bạn
        });
    });
}

//Hết phần chức năng hủy gửi yêu cầu kết bạn


//Chức năng từ chối kết bạn

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse"); // closet dùng để lấy ra box cha và sau đó add thêm class refuse để khi ấn vào chữ xóa thì sẽ xóa
            const userId = button.getAttribute("btn-refuse-friend"); // lấy ra thuộc tính của btn-add-friend tức là id của người gửi kết bạn

            socket.emit("CLIENT_REFUSE_FRIEND", userId);//gửi lên server id của người mình vừa hủy kết bạn
        });
    });
}

//Hết phần chức năng từ chối kết bạn

//Chức năng chấp nhận

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted"); 
            const userId = button.getAttribute("btn-accept-friend"); 
            socket.emit("CLIENT_ACCEPT_FRIEND", userId);//gửi lên server id của người mình vừa hủy kết bạn
        });
    });
}

//Hết phần chức năng chấp nhận kết bạn


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND

socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelectorAll("[badge-users-accept]");

    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    if(userId == data.userId){// để kiểm tra xem có đúng là id của B không về chỉ trả về số lượng lời mời kết bạn cho B
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
    
});

// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND