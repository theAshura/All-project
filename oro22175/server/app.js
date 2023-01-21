const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const express = require("express");
const compression = require("compression");

const appConfig = require("./config/env");
const routerApp = require("./config/router.config");

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.set("view", path.join(__dirname, "../build"));
app.set("view engine", "ejs");
app.use(routerApp);

app.listen(appConfig.port, appConfig.host, () => {
  console.log(
    `App running port: ${appConfig.port} in ${process.env.NODE_ENV} environment.`
  );
});
module.exports = app;
