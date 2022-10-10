const mongoose = require("mongoose");
const packageDbHandler = new Object();
const packageSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    minlength: 3,
    uppercase: true,
  },

  MonthlyCost: {
    type: Number,
    required: true,
  },
});
const PackageData = mongoose.model("Package", packageSchema);

packageDbHandler.getPackage = async (propertyList) => {
  return await PackageData.find(propertyList);
};

packageDbHandler.createPackage = async (packages) => {
  const packageData = new PackageData(packages);

  return await packageData.save();
};

packageDbHandler.deletePackage = async (propertyList) => {
  return await PackageData.findOneAndDelete(propertyList);
};

packageDbHandler.updatePackage = async (id, object) => {
  const packages = await PackageData.findById(id);
  if (!packages) {
    new Error("No such Package");
    return;
  }
  try {
    packages.set(object);
    return await packages.save();
  } catch (err) {
    return new Error(err);
  }
};

module.exports = {PackageData,packageDbHandler};
