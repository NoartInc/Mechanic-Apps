require("dotenv").config();
const { JWT_SECRET } = process.env;
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];

    if (!auth) {
      throw new Error("Unauthenticated");
    }

    const token = auth.split("Bearer ")[1];

    if (!token || token === null) {
      throw new Error("Unauthenticated");
    }

    const verifyToken = jwt.verify(token, JWT_SECRET);

    const user = await Users.findByPk(verifyToken?.id, {
      include: ["userRole"]
    });

    if (!user) {
      throw new Error("Unauthenticated ");
    }

    // if (user.role !== "admin") {
    //   throw new Error("Unauthorized");
    // }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: err.message,
    });
  }
};
