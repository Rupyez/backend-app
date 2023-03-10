const User = require("../models/User.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

// register user
const registerUser = catchAsyncErrors(async (req, res) => {
  let body = req.body;
  const user = await User.create(body);

  // Calling the token
  sendToken(user, 201, res);
});

// login user
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    let error = new Error("Please enter email and password.")
    error.statusCode = 400
    throw error
    
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    let error = new Error("Invalid email or password.")
    error.statusCode = 401
    throw error
   
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    let error = new Error("Invalid email or password.")
    error.statusCode = 401
    throw error
    
  }
  sendToken(user, 200, res);
});

// logout
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// forget password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);

  if (!user) {
    let error = new Error("User not found.")
    error.statusCode = 404
    throw error
  }

  // Get reset Password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/password/reset/${resetToken}`;

  console.log(resetPasswordUrl);

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: ` Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.log(error);
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(ErrorHandler(error.message, 500));
  }
});

// reset Password
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token: resetToken } = req.params;
  // creating hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    let error = new Error("Reset Password Token is invalid or has been expired")
    error.statusCode = 400
    throw error
   
  }

  if (req.body.password !== req.body.confirmPassword) {
    let error = new Error("Unable to update the password.")
    error.statusCode = 400
    throw error

  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const savedUser = await User.findOne({ _id: user._id }, "-password");

  sendToken(savedUser, 201, res);
});

// Get User Detail
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//  upadate password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    let error = new Error("Old password is incorrect")
    error.statusCode = 400
    throw error
   
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    let error = new Error("Password doesnot match")
    error.statusCode = 400
    throw error
 
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//   // Get all users(admin)
const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//   // Get single user (admin)
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    let error = new Error(`User doesnot exist with ID:${req.params.id}`)
    error.statusCode = 404
    throw error
   
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update Role -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    ...req.body,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidator: true,
  });
  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  User.findByIdAndDelete(req.params.id, function (err, user) {
    if (err) {
      let error = new Error(`User does not exist with Id: ${req.params.id}`)
      error.statusCode = 400
      throw error
     
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
};
