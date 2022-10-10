const express = require("express");
const route = express.Router();
const {dbHandler} = require("./CustomerdbHandler");
const Joi = require("joi");
const auth = require("../Middleware/auth");

route.get("/", auth, async (req, res) => {
 
  const customers = await dbHandler
  .getCustomer(res);

  res.status(200).send(customers);
});

route.get("/:id", auth, async (req, res) => {
  const { params } = req;
  try {
    const customer = await dbHandler
    .getCustomer({ _id: params.id }, res);

    if (!customer) return res.status(404).send("Not found");
    else res.status(200).send(customer[0]);
  } catch (error) {
    return res.status(500).send("Something went wrong!!");
  }
});

route.post("/", auth, async (req, res) => {
  const error = validateCustomer(req.body, res);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
   
  const result = await dbHandler
  .createCustomer(req.body, res);
  res.status(200).send(result);
});

route.put("/:id", auth, async (req, res) => {
  const { params } = req;

  try {
	const result = await dbHandler
	  .updateCustomer(params.id, req.body, res);
	    
	  res.status(200).send(result);
} catch (error) {
  if(error.message)
  
   res.status(400).send(error.message);
	
}
});

route.delete("/:id", auth, async (req, res) => {
  const { params } = req;

  const result = await dbHandler
  .deleteCustomer({ _id: params.id }, res);

  res.status(200).send(result);
});

let validateCustomer = (customer) => {
  const schema = {
    Name: Joi.string().min(3).required(),
    Package:  Joi.object().required(),
    PaymentCleared: Joi.boolean().required(),
    PaymentDue: Joi.number().required(),
    MonthlyCost:Joi.array().required(),
    PPPOeId : Joi.array(),
    Phone : Joi.number().required(),
    Adress : Joi.string().min(3).required(),
    SuscribeDate:Joi.date(),

  };
  const { error } = Joi.validate(customer, schema);
  return error;
};

module.exports = route;
