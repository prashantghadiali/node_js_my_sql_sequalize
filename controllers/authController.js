const { User } = require("../models");
const {
  SuccessMsgResponse,
  InternalErrorResponse,
  SuccessResponse,
  BadRequestResponse,
  AuthFailureResponse,
} = require("../utils/apiResponse");
const {
  generateToken,
  comparePassword,
  refreshToken,
} = require("../utils/auth");
const { TokenBlacklist } = require("../models");

// Registration controller
const adminRegister = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    contactNumber,
    postcode,
    password,
    hobbies,
    gender
  } = req.body;

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return new InternalErrorResponse("Email is already in use").send(res);
    }

    const userRole = "user";

    const user = await User.create({
      firstname,
      lastname,
      email,
      contactNumber,
      postcode,
      password,
      hobbies,
      gender,
      role: userRole,
    });

    const token = generateToken(user);
    const reftoken = refreshToken(user);

    const successResponse = new SuccessResponse(
      "Admin Registered in successfully"
    );
    successResponse.access_token = token;
    successResponse.refresh_token = reftoken;

    return successResponse.send(res);
  } catch (error) {
    console.error("error :", error);
    return new InternalErrorResponse("An unexpected error occurred.", {
      error,
    }).send(res);
  }
};

// Login controller
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    //   console.log("user :", user);
    if (!user) {
      return new BadRequestResponse("Invalid User").send(res);
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return new InternalErrorResponse("Invalid email or password").send(res);
    }

    if (user.role !== "admin") {
      return new AuthFailureResponse("Unauthorized access").send(res);
    }

    const token = generateToken(user);
    const reftoken = refreshToken(user);

    const successResponse = new SuccessResponse("Admin logged in successfully");
    successResponse.access_token = token;
    successResponse.refresh_token = reftoken;

    return successResponse.send(res);
  } catch (error) {
    console.error("Login error:", error);
    return new InternalErrorResponse("Error logging in user").send(res);
  }
};

const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Add token to blacklist
    await TokenBlacklist.create({ token });

    return new SuccessMsgResponse("Logout successful").send(res);
  } catch (error) {
    console.error("Error logging out:", error);
    return new InternalErrorResponse("Error logging out").send(res);
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  logout,
};
