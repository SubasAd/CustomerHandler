const express = require("express");
const usermodel = require("../Models/user");
const route = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

const auth = require("../Middleware/auth");

route.get("/me", auth, async (req, res) => {
  const user = await usermodel.UserData.findById(req.user._id).select(
    "-password"
  );
  res.send(user);
});
route.post("/register", async (req, res) => {
  const { error } = usermodel.validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let User = await usermodel.UserData.findOne({ email: req.body.email });

  if (User) return res.status(400).send("User existes already");
  User = new usermodel.UserData({
    Name: req.body.Name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  User.password = await bcrypt.hash(User.password, salt);
  const token = User.generateAuthToken();
  res
    .header("x-auth-token", token)
    .status(200)
    .send(await User.save());
});
module.exports = route;
