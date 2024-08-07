const express = require('express');
var path = require('path');
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");
const http = require('http');
const { Server } = require("socket.io");
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

//Socket io
const server = http.createServer(app);
const io = new Server(server);
global._io = io
// End socket.io

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;// để biến prefixAdmin này tồn tại ở tất cả các file pug
app.locals.moment = moment;

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

app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
      pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});