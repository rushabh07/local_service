import mongoose from "mongoose";

// {
//   "_id": "u101",
//   "name": "rushabh saraiya",
//   "email": "rushabh@gmail.com",
//   "password": "hashed_password",
//   "phone": "9876543210",
//   "role": "customer",
//   "address": "pune, india"
// }

const userSchema = new mongoose.Schema({
  // _id: {
  //   type: String
  // },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    default: "customer"
  },
  address: {
    type: String
  }
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // }
});

export default mongoose.model("users", userSchema);