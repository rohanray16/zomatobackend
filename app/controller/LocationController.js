const LocationModel = require("../model/LocationModel");
const locationList = require("../resources/location.json"); // only to insert
const LocationController = {
  getLocationList: async function (request, response) {
    try {
      let result = await LocationModel.find();
      response.status(200).send({
        status: true,
        location: result,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  getLocationByCity: async function (request, response) {
    let { city } = request.query;
    try {
      let result = await LocationModel.find({
        city: { $regex: city + ".*", $options: "i" },
      });
      response.status(200).send({
        status: true,
        location: result,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  addLocationList: async function (request, response) {
    try {
      let result = await LocationModel.insertMany(locationList);
      response.status(200).send({
        status: true,
        message: "added successfully",
        result: result,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
};

module.exports = LocationController;
