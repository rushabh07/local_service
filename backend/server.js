import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/userroute.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});