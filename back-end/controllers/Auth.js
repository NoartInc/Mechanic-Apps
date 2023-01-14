require("dotenv").config();
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const logging = require("../utils/logging");
const { getRow } = require("../controllers/User");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      const existCheck = await Users.findOne({
        where: { userName: username },
      });

      if (!existCheck) {
        return res.status(400).json({
          status: false,
          error: `user ${username} tidak terdaftar`,
        });
      }

      const pwdCheck = password === existCheck.password;

      if (!pwdCheck) {
        return res.status(400).json({
          status: false,
          error: "Error!, password salah",
        });
      }

      const accessToken = jwt.sign(
        {
          id: existCheck?.id,
        },
        JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      /**
       * Panggil fungsi logging ketika semua validasi berhasil
       * atau panggil logging sebelum return success
       */
      logging(username, "Login", "Melakukan login ke sistem");

      const userData = await getRow(existCheck?.id);

      return res.status(201).json({
        status: true,
        data: {
          user: userData,
          token: accessToken,
        },
      });
    }
    return res.status(200).json({
      status: false,
      error: "Unknown request",
      request_body: req.body,
    });
  } catch (err) {
    return next(err);
  }
};
