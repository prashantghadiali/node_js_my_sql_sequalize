const { User, Role, UserRole } = require("../models");
const { SuccessMsgResponse, SuccessResponse, InternalErrorResponse, BadRequestResponse, ForbiddenResponse, NotFoundResponse, AuthFailureResponse } = require("../utils/apiResponse");
const {
  generateToken,
  refreshToken,
  comparePassword,
} = require("../utils/auth");

// Registration controller
const userRegister = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    contactNumber,
    postcode,
    password,
    hobbies,
    gender,
  } = req.body;

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return new InternalErrorResponse('Email is already in use').send(res);
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

    const successResponse = new SuccessResponse("User Registered in successfully");
    successResponse.access_token = token;
    successResponse.refresh_token = reftoken;

    return successResponse.send(res);

  } catch (error) {
    console.error("error :", error);
    return new InternalErrorResponse("Error creating user").send(res);
  }
};

// user Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return new InternalErrorResponse("Invalid User").send(res);
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return new InternalErrorResponse("Invalid email or password").send(res);
    }

    const token = generateToken(user);
    const reftoken = refreshToken(user);

    const successResponse = new SuccessResponse("User logged in successfully");
    successResponse.access_token = token;
    successResponse.refresh_token = reftoken;

    return successResponse.send(res);

  } catch (error) {
    console.error("Login error:", error);
    return new InternalErrorResponse("Error Login user").send(res);
  }
};

// Upload File
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return new InternalErrorResponse("No File Uploaded").send(res);
    }

    // Access uploaded file details
    const { filename, path: filePath } = req.file;

    // return SuccessMsgResponse("files Fetched Sucessfully", {
    //   filename,
    //   filePath,
    // });
    const successResponse = new SuccessResponse("files Fetched Sucessfully");
    successResponse.filename = filename;
    successResponse.filePath = filePath;

    return successResponse.send(res);
  } catch (error) {
    console.error("Error uploading file:", error);
    return new InternalErrorResponse("Error Uploading File").send(res);
  }
};

// for Delete
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUser = req.user; 

    // Check if the user is trying to update their own status
    if (requestingUser.id === parseInt(userId)) {
      return new BadRequestResponse("You cannot change your own status").send(res);
    }

    // Check if the requesting user is an admin
    if (requestingUser.role !== 'admin') {
      return new BadRequestResponse("Only admins can change user status").send(res);
    }

    const user = await User.findByPk(userId);
    if (user) {
      user.status = 'inactive'; 
      await user.save();
      return res.json({ message: 'User status updated to inactive' });
    } else {
      return new BadRequestResponse("User not found").send(res);
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    return InternalErrorResponse("Error updating user status").send(res);
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.scope('withoutPassword').findAll({
      where: { status: 'active' }
    });
    res.json(activeUsers);
  } catch (error) {
    console.error('Error fetching active users:', error);
    return new InternalErrorResponse("Error fetching active users").send(res)
  }
};

const getActiveUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.scope('withoutPassword').findOne({
      where: {
        id: userId,
        status: 'active'
      }
    });
    if (user) {
      return res.json(user);
    } else {
      return new BadRequestResponse("Active user not found").send(res);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return InternalErrorResponse("Error fetching user").send(res);
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUser = req.user; // assuming req.user contains the logged-in user's info

    const user = await User.scope('withoutPassword').findByPk(userId);
    if (!user) {
      return new NotFoundResponse('User not found').send(res);
    }

    if (requestingUser.id === parseInt(userId)) {
      // User updating their own data
      const { firstname, lastname, email, contactNumber, postcode, hobbies, gender } = req.body;
      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.email = email || user.email;
      user.contactNumber = contactNumber || user.contactNumber;
      user.postcode = postcode || user.postcode;
      user.hobbies = hobbies || user.hobbies;
      user.gender = gender || user.gender;
    } else {
      // Admin updating other user data
      if (requestingUser.role !== 'admin') {
        return new ForbiddenResponse('Only admins can update other users').send(res);
      }
      const { firstname, lastname, email, contactNumber, postcode, hobbies, gender, status } = req.body;
      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.email = email || user.email;
      user.contactNumber = contactNumber || user.contactNumber;
      user.postcode = postcode || user.postcode;
      user.hobbies = hobbies || user.hobbies;
      user.gender = gender || user.gender;
      user.status = status || user.status; // Only admins can update status
    }

    await user.save();
    return new SuccessResponse('User updated successfully').send(res);
  } catch (error) {
    return new InternalErrorResponse(error.message).send(res);
  }
};

// Disable User
const disableUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return new BadRequestResponse("User not found").send(res);
    }

    // Only allow disabling account by admins (you can modify the condition as per your roles)
    if (user.role === 'admin') {
      user.status = 'inactive'; // Set status to 'inactive' (or another appropriate value)
      await user.save();
      return new SuccessMsgResponse('User account disabled successfully',{user}) 
    } else {
      return new AuthFailureResponse(error.message).send(res);
    }
  } catch (error) {
    console.error(error);
    return new InternalErrorResponse('Error disabling user account').send(res);
  }
};

// enable user
const enableUser =  async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return new BadRequestResponse("User not found").send(res);
    }

    // Only allow enabling account by admins (you can modify the condition as per your roles)
    if (user.role === 'admin') {
      user.status = 'active'; // Set status to 'active' (or another appropriate value)
      await user.save();
      
      return new AuthFailureResponse(error.message).send(res);
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    return new InternalErrorResponse('Error enabling user account').send(res);
  }
}

// Attach Role to User
const attachRoleToUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const { roleId } = req.body;

      const user = await User.findByPk(userId);
  
      if (!user) {
          return new NotFoundResponse('User not found').send(res);
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
          return new NotFoundResponse('Role not found').send(res);
      }

      await UserRole.create({ userId: user.id, roleId: role.id });

      return new SuccessResponse('Role attached successfully').send(res);
  } catch (error) {
      return new InternalErrorResponse(error.message).send(res);
  }
};

// Detach Role from User
const detachRoleFromUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roleId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundResponse('User not found').send(res);
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new NotFoundResponse('Role not found').send(res);
    }

    await user.removeRole(role);
    return new SuccessResponse('Role detached successfully').send(res);
  } catch (error) {
    return new InternalErrorResponse(error.message).send(res);
  }
};


module.exports = {
  userRegister,
  userLogin,
  uploadFile,
  updateUserStatus,
  getActiveUsers,
  getActiveUserById,
  updateUser,
  disableUser,
  enableUser,
  attachRoleToUser,
  detachRoleFromUser
};
