const express = require("express");
const route = express.Router();
const {packageDbHandler} = require("./PackageDbHandler");
const Joi = require("joi");
const auth = require("../Middleware/auth");

route.get("/", auth, async (req, res) => {
  const packages = await packageDbHandler.getPackage(res);

  res.status(200).send(packages);
});

route.get("/:id", auth, async (req, res) => {
  const { params } = req;
  try {
    const packages = await packageDbHandler.getPackage({ _id: params.id }, res);

    if (!packages) return res.status(404).send("Not found");
    else res.status(200).send(packages);
  } catch (error) {
    return res.status(500).send("Something went wrong!!");
  }
});

route.post("/", auth, async (req, res) => {
  const error = validatePackage(req.body, res);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const result = await packageDbHandler.createPackage(req.body, res);
  res.status(200).send(result);
});

route.put("/:id", auth, async (req, res) => {
  const { params } = req;

  const result = await packageDbHandler.updatePackage(params.id, req.body, res);

  if (result.message) {
    res.status(400).send(result.message);
  } else res.status(200).send(result);
});

route.delete("/:id", auth, async (req, res) => {
  const { params } = req;

  const result = await packageDbHandler.deletePackage({ _id: params.id }, res);

  res.status(200).send(result);
});

let validatePackage = (packages) => {
  const schema = {
    Name: Joi.string().min(3).required(),
    MonthlyCost: Joi.number().required(),
    
  };
  const { error } = Joi.validate(packages, schema);
  return error;
};

module.exports = route;
