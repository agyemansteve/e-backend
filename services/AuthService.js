const createError = require("http-errors");
const UserModel = require("../models/user");
const UserModelInstance = new UserModel();
const bcrypt = require("bcryptjs");
module.exports = class AuthService {
  async register(data) {
    const { email } = data;

    try {
      // Check if user already exists
      const user = await UserModelInstance.findOneByEmail(email);

      // If user already exists, reject
      if (user) {
        throw createError(409, "Email already in use");
      }

      // User doesn't exist, create new user record

      return await UserModelInstance.create(data);
    } catch (err) {
      throw createError(500, err);
    }
  }

  async login(data) {
    const { email, password } = data;

    try {
      const user = await UserModelInstance.findOneByEmail(email);

      if (!user) {
        throw createError(
          401,
          "Incorrect username or password or user does not exist"
        );
      }
      const result = await bcrypt.compare(password, user.password);
      if (result !== true) {
        throw createError(401, "Incorrect username or password");
      }
      const payload = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };

      return payload;
    } catch (error) {
      console.log(error);
    }
  }
};
