const Vendor =
require("../models/Vendor");

exports.createVendor =
async (req, res) => {

  try {

    const vendor =
      await Vendor.create(req.body);

    res.status(201).json(vendor);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.getVendors =
async (req, res) => {

  try {

    const vendors =
      await Vendor.find();

    res.json(vendors);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};