const mongoose = require("mongoose");
const dbHandler = new Object();
const CustomerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    minlength: 3,
    uppercase: true,
  },
  Package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  MonthlyCost: {
    type: Array,
    required: true,
  },
  Phone : {
    type:Number,
    required:true
  },
  PPPOeId : { type: Array,
    required: true},
    Adress:{
      type:String
    },
    SuscribeDate:{
      type:Date
    },
    ConnectionDate:{
      type:Date
    },
  
  PaymentCleared: Boolean,
  PaymentDue: Number,
});
const CustomerData = mongoose.model("Customer", CustomerSchema);

dbHandler.getCustomer = async (propertyList) => {
  const Customer =  await CustomerData
       .find(propertyList)
       .populate('Package');
       console.log(Customer);
       return Customer;
       
};

dbHandler.createCustomer = async (customer) => {
 customer.Package =customer.Package._id
  const customerData = new CustomerData(customer);

  return await customerData.save();
};

dbHandler.deleteCustomer = async (propertyList) => {
  return await CustomerData.findOneAndDelete(propertyList);
};

dbHandler.updateCustomer = async (id, object) => {
  const customer = await CustomerData.findById(id);
  if (!customer) {
    new Error("No such Customer");
    return;
  }
  try {
    object.Package = object.Package._id;
    customer.set(object);
    if (customer.PaymentCleared) customer.PaymentDue = 0;

    return await customer.save();
  } catch (err) {
    return new Error(err);
  }
};

module.exports = {CustomerData,dbHandler};
