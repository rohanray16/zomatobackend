const RestaurantModel = require("../model/RestaurantModel");
const restaurantList = require("../resources/restaurant.json"); // only to insert
const RestaurantController = {
  getRestaurantList: async function (request, response) {
    try {
      let result = await RestaurantModel.find();
      response.status(200).send({
        status: true,
        restaurant: result,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  addRestaurantList: async function (request, response) {
    try {
      let result = await RestaurantModel.insertMany(restaurantList);
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
  getRestaurantDetailsById: async function (request, response) {
    try {
      let { id } = request.params;
      let data = await RestaurantModel.findById(id);
      response.status(200).send({
        status: true,
        result: data,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  getRestaurantLocationId: async function (request, response) {
    let { lid, rest } = request.query;

    try {
      let data = await RestaurantModel.find(
        {
          name: { $regex: rest + ".*", $options: "i" },
          location_id: Number(lid),
        },
        { name: 1, image: 1, locality: 1, _id: 1, city: 1 }
      );
      response.status(200).send({ status: true, result: data });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  filterRestaurant: async function (request, response) {
    console.log(request.body);
    let {
      mealtype,
      location,
      cuisine,
      lcost,
      hcost,
      page,
      sort,
      itemsPerPage,
    } = request.body;
    sort = sort ? sort : 1;
    page = page ? page : 1;
    itemsPerPage = itemsPerPage ? itemsPerPage : 2;

    // 1,2,3,4 = 0 1 2 3
    // [KFC , BABA ka Dhaba,Domino's, Burger King]
    // [0,1,2,3] ==> [0,1]
    // slide(2,4)
    // 2 * 2 - 2 ===> 2
    // 2 * 2===> 4

    let staringIndex = page * itemsPerPage - itemsPerPage; //0
    let lastIndex = page * itemsPerPage; // 2
    // sort high to low -1
    // sort low to high 1

    // lcost = 500
    // hcost = 1000

    let filterObject = {};

    if (mealtype) filterObject["mealtype_id"] = mealtype;
    if (location) filterObject["location_id"] = location;
    if (lcost && hcost)
      filterObject["min_price"] = { $lte: hcost, $gte: lcost };

    cuisine && (filterObject["cuisine_id"] = { $in: cuisine });
    console.log(filterObject);

    try {
      let result = await RestaurantModel.find(filterObject, {
        aggregate_rating: 1,
        city: 1,
        image: 1,
        locality: 1,
        name: 1,
        min_price: 1,
        cuisine: 1,
      }).sort({
        min_price: sort,
      });
      let filterResult = result.slice(staringIndex, lastIndex);
      console.log(filterResult);
      response.status(200).send({
        status: true,
        result: filterResult,
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

module.exports = RestaurantController;
