const express = require("express");
const usermodel = require("../Models/user");

const route = express.Router();

const bcrypt = require("bcrypt");
const Joi = require("joi");

route.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let User = await usermodel.UserData.findOne({ email: {$regex : new RegExp(req.body.email, "i")} });

  if (!User) return res.status(400).send("Invalid Email or Password");

  const validPassword = await bcrypt.compare(req.body.password, User.password);
 
  if (!validPassword) return res.status(400).send("Invalid Email or Password");
  const token = User.generateAuthToken();

  res
    .header("x-auth-token", token)
    .status(200)
    .send("Successfully Logged In !!");
});
const validateAuth = (User) => {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  const error = Joi.validate(User, schema);
  return error;
};

module.exports = route;
