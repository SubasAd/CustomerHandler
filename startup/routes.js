const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const checkAuth = require('../Middleware/auth');
const morgan = require('morgan')
const customers = require('../routes/Customer');
const packages = require('../routes/Package');
const users =  require("../routes/user");
const auth = require('../routes/auth');
const errorHandle = require('../Middleware/error');

module.exports = function (app,) {
  app.use(cors({
    origin: '*',
    exposedHeaders:'x-auth-token'
}))
  app.use(express.json());
   
  app.use(helmet());
  app.use(morgan("tiny"));

  app.use("/api/users", users);
  app.use("/api/login", auth);
  app.use(checkAuth);
  app.use("/api/customers", customers);
  app.use("/api/packages", packages);
  app.use(errorHandle);
};
