require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const statsRoutes = require("./routes/statsRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trusted Notifications Orchestrator API is running");
});

app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/preferences", preferenceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
