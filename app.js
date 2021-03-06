// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();
// const path = require('path');

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('views',__dirname + 'views');

//require session config
require('./config/session.config')(app);

// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "gitStat";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

//login route
const login = require("./routes/login.routes");
app.use("/", login);

//register route
const register = require("./routes/register.routes");
app.use("/", register);

//my repos
const myRepos = require("./routes/update.repos.routes");
app.use("/",myRepos);

// Statistics
const statistics = require("./routes/statistics.routes");
app.use("/", statistics);

//Main route
const home = require("./routes/home.routes");
app.use("/", home);

// 👇 Start handling routes here
/* const index = require("./routes/index");
app.use("/", index); */

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;