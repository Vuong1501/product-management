const md5 = require('md5');
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");




// [GET] /admin/account
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }
    console.log(records);
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    });
};

// [GET] /admin/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
};

// [POST] /admin/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if(emailExist){

        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");

    } else {

        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }


};