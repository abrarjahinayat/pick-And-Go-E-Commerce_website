const session = require("express-session");
const userModel = require("../model/signup.model");
const randomnumber = require("../utils/otp");
const sendEmail = require("../utils/send_email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupControllers = async (req, res, next) => {
  const otp = randomnumber();

  let { name, email, password, phone, role, image } = req.body;

  let userExist = await userModel.findOne({ email });

  if (userExist) {
    return res.status(400).json({
      success: false,
      message: "user already exist",
    });
  } else {
    let user = new userModel({
      name,
      email,
      password,
      phone,
      role,
      image,
      otp,
    });

    await user
      .save()
      .then(() => {
        sendEmail(email, otp);

        setTimeout(async () => {
          let otpremove = await userModel.findOneAndUpdate(
            { email },
            { otp: null },
            { new: true }
          );

          await otpremove
            .save()
            .then(() => {
              console.log("otp removed successfully");
            })
            .catch((err) => next(err));
        }, 60000);

        let info = {
          name: user.name,
          email: user.email,
          otp: user.otp,
        };

        return res.status(201).json({
          success: true,
          message: "user signup successfully",
          data: info,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const verifyOtpControllers = async (req, res, next) => {
  let { email, otp } = req.body;

  let user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  } else {
    if (user.otp === otp) {
      let verifyuser = await userModel
        .findOneAndUpdate({ email }, { verify: true, otp: null }, { new: true })
        .select("-password");
      return res.status(200).json({
        success: true,
        message: "user verified successfully",
        data: verifyuser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  }
};

const loginControllers = async (req, res, next) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "invalid email or password",
    });
  } else {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.PRIVATE_KEY,
          { expiresIn: "24h" }
        );

        // req.session.cookie.maxAge = 60000;
        // req.session.userinfo = user;

        return res.status(200).json({
          success: true,
          message: "user login successfully",
          data: user,
          token,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "invalid email or password",
        });
      }
    });
  }
};

const allusersControllers = async (req, res, next) => {
  // console.log(req.session.userinfo);

  try {
    let allusers = await userModel.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "all users",
      data: allusers,
    });
  } catch (error) {
    next(error);
  }
};

const verifyUserControllers = async (req, res, next) => {
  let { token } = req.headers;

  jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: err.message,
      });
    } else {
      userModel
        .findOne({ email: decoded.email })
        .then((user) => {
          let token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.PRIVATE_KEY,
            { expiresIn: "24h" }
          );
          return res.status(200).json({
            success: true,
            message: "user verified successfully",
            data: user,
            token,
          });
        })
        .catch((err) => {
          return res.status(401).json({
            success: false,
            message: err.message,
          });
        });
    }
  });
};

const forgetPasswordControllers = async (req, res, next) => {
  try {
    let { email } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      const otp = randomnumber();
      user.otp = otp;
      await user.save();
      sendEmail(email, otp);
      return res.status(200).json({
        success: true,
        message: "otp sent successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const verifyPasswordOtpControllers = async (req, res, next) => {
  try {
    let { email, otp } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      if (String(user.otp) === String(otp)) {
        await user.save();
          setTimeout(async () => {
          let otpremove = await userModel.findOneAndUpdate(
            { email },
            { otp: null },
            { new: true }
          );

          await otpremove
            .save()
            .then(() => {
              console.log("otp removed successfully");
            })
            .catch((err) => next(err));
        }, 60000);
        return res.status(200).json({
          success: true,
          message: "otp verified successfully",
          
        });

        return res.redirect("http://localhost:3000/order-success");
       
      } else {
        return res.status(404).json({
          success: false,
          message: "Invalid OTP",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
  }
};

const resetPasswordControllers = async (req, res, next) => {
   try {

    let { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
       bcrypt.hash(password, 10, async function(err, hash) {
        // Store hash in your password DB.
        let resetpassword = await userModel.findOneAndUpdate(
         { email },
         { password: hash },
         { new: true }
       )
       await resetpassword.save();
   
       return res.status(200).json({
         success: true,
         message: "password reset successfully",
       });
    });

    }
    
   } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message || error,
    });
   }
}

module.exports = {
  signupControllers,
  verifyOtpControllers,
  loginControllers,
  allusersControllers,
  verifyUserControllers,
  forgetPasswordControllers,
  verifyPasswordOtpControllers,
  resetPasswordControllers
};
