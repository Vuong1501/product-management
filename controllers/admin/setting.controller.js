const SettingGeneral = require("../../models/settings-general.model");


// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({}); // luôn luôn lấy ra bản ghi đầu tiên

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingsGeneral,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingsGeneral = await SettingGeneral.findOne({});
    if (settingsGeneral) {
      await SettingGeneral.updateOne({}, req.body);
    } else {
      const record = new SettingGeneral(req.body);
      await record.save();
    }
    req.flash('success',"Cập nhập thành công");
  
    res.redirect("back");
  };