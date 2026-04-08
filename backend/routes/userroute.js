import express from "express";
import users from "../models/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const user = new users(req.body)
  // console.log(user)
  await user.save();
  res.json({msg: "user added successfully"});
});

router.get("/users", async (req, res) => {
  
  try {
  const users_data = await users.find();
  res.json(users_data);
  }
  catch (error) {
     res.status(500).json({ message: error.message });
  }
});

export default router;