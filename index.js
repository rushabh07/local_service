const express = require("express");
const app = express();

app.use(express.json());

const connectDB = require("./config/db");
connectDB();

const bookingRoutes = require("./routes/BookingRoutes");
app.use("/api/bookings", bookingRoutes);

const providerRoutes = require("./routes/ProviderRoutes");
app.use("/api/providers", providerRoutes);

const serviceRoutes = require("./routes/ServiceRoutes");
app.use("/api/services", serviceRoutes);

app.use(express.json());

// IMPORT ROUTES
const userRoutes = require("./routes/UserRoutes");

// USE ROUTES
app.use("/api/users", userRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
res.send("API running");
});

app.listen(3000, () => {
console.log("Server started on port 3000");
});