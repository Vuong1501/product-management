const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");// cần nhúng file này vào để có thể dùng

module.exports = (app) => { // chuyền app vào vì bên file index.js có biến app
    app.use('/', homeRoutes);

    app.use("/products", productRoutes );// vì hàm bên kia đã có get rồi nên bên này chỉ cần .use để sử dụng
}