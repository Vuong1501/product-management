const categoryMiddleware = require("../../middlewares/client/category.middleware");
const carrtMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");



const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");// cần nhúng file này vào để có thể dùng
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");
const roomsChatRoutes = require("./rooms-chat.route");

module.exports = (app) => { // chuyền app vào vì bên file index.js có biến app

    app.use(categoryMiddleware.category);
    app.use(carrtMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.settingGeneral);

    app.use('/', homeRoutes);

    app.use("/products", productRoutes );// vì hàm bên kia đã có get rồi nên bên này chỉ cần .use để sử dụng

    app.use("/search", searchRoutes );

    app.use("/cart", cartRoutes );

    app.use("/checkout", checkoutRoutes );

    app.use("/user", userRoutes );

    app.use("/chat", authMiddleware.requireAuth, chatRoutes );

    app.use("/users", authMiddleware.requireAuth, usersRoutes );

    app.use("/rooms-chat", authMiddleware.requireAuth, roomsChatRoutes );


}