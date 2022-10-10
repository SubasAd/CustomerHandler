require("express-async-errors");
const winston = require("winston");
const express = require("express");
const cors = require('cors');
 require('./startup/logging')();
const app = express();
 require("./startup/database")();
 require("./startup/routes")(app);
 require('./startup/configuration')();
require("./startup/prod")(app);
const port = process.env.PORT || 3000;

 app.listen(port, () => winston.log("info","Listening" + port));


