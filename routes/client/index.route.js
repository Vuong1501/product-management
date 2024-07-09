const categoryMiddleware = require("../../middlewares/client/category.middleware");
const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");// cần nhúng file này vào để có thể dùng
const searchRoutes = require("./search.route");

module.exports = (app) => { // chuyền app vào vì bên file index.js có biến app

    app.use(categoryMiddleware.category);

    app.use('/', homeRoutes);

    app.use("/products", productRoutes );// vì hàm bên kia đã có get rồi nên bên này chỉ cần .use để sử dụng

    app.use("/search", searchRoutes );
}