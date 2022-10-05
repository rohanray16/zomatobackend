const UsersModel = require("../model/UsersModel");
const bcrypt = require("bcrypt");
/*
  d = 12a
  e = 22b
  p = 87p
  k = 97t
*/

const UsersController = {
  userSignUp: async function (request, response) {
    let data = request.body;
    let password = data.password;
    let saltRound = 10;
    // insert user
    try {
      let salt = await bcrypt.genSalt(saltRound);
      let hashPassword = await bcrypt.hash(password, salt);
      const newUser = new UsersModel({
        email: data.email,
        password: hashPassword,
        firstname: data.firstname ? data.firstname : undefined,
        lastname: data.lastname ? data.lastname : undefined,
      });

      let result = await UsersModel.findOne({ email: data.email });
      // check already exist email
      if (result) {
        response.status(200).send({
          status: false,
          message: "Email id is already exist, user other email id",
        });
      } else {
        let saveResult = await newUser.save();
        response.status(200).send({
          status: true,
          result: saveResult,
        });
      }
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  userLogin: async function (request, response) {
    let data = request.body;
    try {
      let result = await UsersModel.findOne({
        email: data.email,
      });
      if (result) {
        let isPasswordMatch = await bcrypt.compare(
          data.password,
          result.password
        );
        if (isPasswordMatch) {
          let { _id, email, firstname, lastname } = result;
          response.status(200).send({
            status: true,
            result: {
              _id,
              email,
              firstname,
              lastname,
            },
            message: "Login successfully !!!",
          });
        } else {
          response.status(200).send({
            status: false,
            message: "Password is wrong.",
          });
        }
      } else {
        response.status(200).send({
          status: false,
          message: "Username is wrong.",
        });
      }
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
};

module.exports = UsersController;
