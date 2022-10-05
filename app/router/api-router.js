const express = require("express");
const router = express.Router();
const meal_type = require("../controller/MealTypeController");
const location = require("../controller/LocationController");
const restaurant = require("../controller/RestaurantController");
const users = require("../controller/UsersController");
const menu_item = require("../controller/MenuItemController");
const paymentController = require("../controller/paymentController");

router.get("/", meal_type.apiHome);
// meals
router.get("/get-meal-types", meal_type.getMealTypes);
router.post("/add-meal-type", meal_type.addMealType);

// location
router.get("/get-location", location.getLocationList);
router.get("/get-location-by-city", location.getLocationByCity);
router.post("/add-location", location.addLocationList);

//restaurant
router.get("/get-restaurant", restaurant.getRestaurantList);
router.post("/add-restaurant", restaurant.addRestaurantList);
router.get("/get-restaurant-by-id/:id", restaurant.getRestaurantDetailsById);
router.get(
  "/get-restaurant-by-location-id",
  restaurant.getRestaurantLocationId
);
router.post("/filter", restaurant.filterRestaurant);

// menu_items
router.get("/get-menu-item", menu_item.getMenuItem);
router.post("/add-menu-item", menu_item.addMenuItem);

// users
router.post("/sign-up", users.userSignUp);
router.post("/login", users.userLogin);

//payment
router.post("/payment",paymentController.payment)
router.post("/callback",paymentController.callback)

module.exports = router;
