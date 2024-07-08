// tách trang này ra nếu bên home.route.js cần dùng đến thì import vào

// [GET] /
module.exports.index =  async (req, res) => { 

    console.log(newProductsCategory);
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ"
    });
};