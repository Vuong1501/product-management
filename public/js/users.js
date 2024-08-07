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


// SERVER_RETURN_INFO_ACCEPT_FRIEND

socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    //trang lời mời kết bạn
    const dataUsersAccept = document.querySelectorAll("[data-users-accept]");
    if(dataUsersAccept){
        const userId = dataUsersAccept.getAttribute("data-users-accept");

    if(userId == data.userId){// để kiểm tra xem có đúng là id của B không về chỉ trả về số lượng lời mời kết bạn cho B
        //vẽ user ra giao diện
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
        newBoxUser.setAttribute("user-id", data.infoUserA._id);

        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="${data.infoUserA.avatar}" alt="${data.infoUserA.fullName}">
                </div>
                <div class="inner-info">
                    <div class="inner-name">
                        ${data.infoUserA.fullName}
                    </div>
                    <div class="inner-buttons">
                        <button
                            class="btn btn-sm btn-primary mr-1"
                            btn-accept-friend="${data.infoUserA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button
                            class="btn btn-sm btn-secondary mr-1"
                            btn-refuse-friend="${data.infoUserA._id}"
                        >
                            Xóa
                        </button>
                        <button
                            class="btn btn-sm btn-secondary mr-1"
                            btn-deleted-friend=""
                            disabled=""
                        >
                            Đã xóa
                        </button>
                        <button
                            class="btn btn-sm btn-primary mr-1"
                            btn-accepted-friend=""
                            disabled=""
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div>
        `;
        dataUsersAccept.appendChild(newBoxUser);
        //Hết vẽ thêm giao diện
        // xóa lời mời kết bạn
        const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]");
        buttonRefuse.addEventListener("click", () => {
            buttonRefuse.closest(".box-user").classList.add("refuse");

            const userId = buttonRefuse.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
      });
      // Hết Xóa lời mời kết bạn

        const buttonAccept = newBoxUser.querySelector("[btn-accept-friend]");
        buttonAccept.addEventListener("click", () => {
            buttonAccept.closest(".box-user").classList.add("accepted");

            const userId = buttonAccept.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      });
    }
    }
    //hết trang lời mời kết bạn

    // Trang danh sách người dùng
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if(dataUsersNotFriend){
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");

        if(userId == data.userId){
            // xóa A khỏi danh sách của B
            const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if(boxUserRemove){
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }

    // Hết trang danh sách người dùng
});

// END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND

socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelectorAll("[data-users-accept]");
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if(userId == data.userId){
        // xóa A khỏi danh sách của B
        const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
        if(boxUserRemove){
            dataUsersAccept.removeChild(boxUserRemove);
        }
        
    }
});

// End SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_ONLINE

socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if(dataUsersFriend){
        const boxUser = dataUsersFriend.querySelector(`[user-id=${userId}]`);
        if(boxUser){
            boxUser.querySelector("[status]").setAttribute("satus", "online");// cập nhật lại thuộc tính thành online
        }
    }
});

// end SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFINE

socket.on("SERVER_RETURN_USER_OFFINE", (userId) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if(dataUsersFriend){
        const boxUser = dataUsersFriend.querySelector(`[user-id=${userId}]`);
        if(boxUser){
            boxUser.querySelector("[status]").setAttribute("satus", "offline");// cập nhật lại thuộc tính thành offline
        }
    }
});

// End SERVER_RETURN_USER_OFFINE