let mealTypeModel = require("../model/MealTypeModel");
let mealType = require("../resources/mealtype.json");
let MealTypeController = {
  apiHome: function (request, response) {
    response.status(200).send({
      status: true,
    });
  },

  getMealTypes: async function (request, response) {
    try {
      let result = await mealTypeModel.find();
      response.status(200).send({
        status: true,
        meal_type: result,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  addMealType: async function (request, response) {
    try {
      let result = await mealTypeModel.insertMany(mealType);
      response.status(200).send({
        status: true,
        message: "meal type added successfully",
        result,
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

module.exports = MealTypeController;
