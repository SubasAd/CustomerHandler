const Joi = require("joi");
const mongoose = require("mongoose");
const usermodel = new Object();
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema({
  Name: { type: String, required: true, minlength: 3, uppercase: true },
  email: {
    type: String,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    unique: true,
    required: true,
    
  },
  password: { type: String, required: true },
});
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};
usermodel.UserData = mongoose.model("User", UserSchema);

usermodel.validateUser = (User) => {
  const schema = {
    Name: Joi.string().min(3).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  const error = Joi.validate(User, schema);
  return error;
};

module.exports = usermodel;
