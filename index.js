const express = require('express');
var path = require('path');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express()
const port = process.env.PORT;

// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride("_method"));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;// để biến prefixAdmin này tồn tại ở tất cả các file pug

app.use(express.static(`${__dirname}/public`));

// Flash 
app.use(cookieParser("ahihi"));
app.use(session({ cookie: { maxAge: 60000}}));
app.use(flash());

// End Flash 
// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//  End Tiny MCE
// Route
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});