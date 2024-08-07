const md5 = require("md5");

const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");


const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");


// [GET] /user/register
module.exports.register =  async (req, res) => { 
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng kí tài khoản",
    });
};

// [POST] /user/register
module.exports.registerPost =  async (req, res) => { 

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail){
        req.flash("error", `Email đã tồn tại`);
        res.redirect("back");
        return;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    // sau khi tạo tài khoản xong sẽ đăng nhập luôn mà không cần phải qua bước đăng nhập
    res.cookie("tokenUser", user.tokenUser);


    // chuyển hướng về trang chủ
    res.redirect("/");
};

// [GET] /user/login
module.exports.login =  async (req, res) => {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập tài khoản",
    });
}

// [POST] /user/loginPost
module.exports.loginPost =  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", `Email không tồn tại`);
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password ){
        req.flash("error", `Sai mật khẩu`);
        res.redirect("back");
        return;
    }

    if(user.status == "inactive" ){
        req.flash("error", `Tài khoản đã bị khóa`);
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    await User.updateOne({_id: user.id}, {
        statusOnline: "online"
    });
    // khi đăng nhập thành công thì server sẽ trả về client socket tên là SERVER_RETURN_USER_ONLINE
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
    });

    // Lưu user_id vào collection cart

    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    });
    
    res.redirect("/");

}

// [GET] /user/logout
module.exports.logout =  async (req, res) => { 

    await User.updateOne({_id: res.locals.user.id}, {
        statusOnline: "offline"
    });

    // khi đăng xuất thì server sẽ trả về client socket tên là SERVER_RETURN_USER_OFFINE
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_OFFINE", res.locals.user.id);
    });
    res.clearCookie("tokenUser");
    res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword =  async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Quên mật khẩu",
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost =  async (req, res) => {

    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", `Email không tồn tại`);
        res.redirect("back");
        return;
    }

    //Viêc 1: Tạo mã OTP và lưu vào DB, email vào collection forgot-pasword
    const otp = generateHelper.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email, // chính là email người ta truyền vào
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    //Việc 2: Gửi mã OTP qua email của user

    const subject = `Mã OTP xác minh láy lại mật khẩu`;
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b> . 
        Thời hạn sử dụng là 3 phút. Lưu ý không để lộ mã OTP ra ngoài
    `;

    sendMailHelper.sendMail(email, subject, html);
    
    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword =  async (req, res) => {

    const email = req.query.email; // để email ở trên thanh url

    res.render("client/pages/user/otp-password.pug", {
        pageTitle: "Nhập mã otp",
        email: email
    });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost =  async (req, res) => {

    const email = req.body.email; // để email ở trên thanh url
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        req.flash("error", `OTP không hợp lê!`);
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });

    // để xác thực xem có đúng là người ta vừa gửi lên yêu cầu lấy lại mật khẩu không vì tokenUser là duy nhất
    res.cookie("tokenUser", user.tokenUser);


    res.redirect("/user/password/reset");
}


// [GET] /user/password/reset
module.exports.resetPassword =  async (req, res) => { 
    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Đổi mật khẩu"
    });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
  
    try {
        await User.updateOne(
        {
          tokenUser: tokenUser,
        },
        {
          password: md5(password),
        }
      );
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
  };


// [GET] /user/info
module.exports.info =  async (req, res) => { 
    res.render("client/pages/user/info.pug", {
        pageTitle: "Thông tin tài khoản",
    });
};