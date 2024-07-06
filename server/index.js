import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const app = express();
const salt = bcrypt.genSaltSync(10);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected to db");
});
const secret = process.env.JWT_SECRET;
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const ex_user = await User.findOne({ username });
  if (ex_user) {
    res.status(400).json({ message: "user already exists" });
  } else {
    const hashpassword = bcrypt.hashSync(password, salt);
    const New_user = await User.create({
      username,
      password: hashpassword,
    });
    jwt.sign(
      {
        userId: New_user._id,
        username,
      },
      secret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(201).json({
          message: "user created successfully",
        });
      }
    );
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.json("user does not exist").status(400);
  } else {
    const passwordCheck = bcrypt.compareSync(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json("invaid password");
    } else {
      jwt.sign(
        {
          userId: user._id,
          username,
        },
        secret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).status(200).json({
            message: "user logged in successfully",
          });
        }
      );
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
