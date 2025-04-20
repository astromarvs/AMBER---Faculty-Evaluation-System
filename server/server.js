const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const schoolRoutes = require("./routes/schoolRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emailRoutes = require("./routes/emailRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Increase the size limit for JSON bodies (e.g., 10MB)
app.use(express.json({ limit: "10mb" })); // Increase the limit to 10MB
app.use(cookieParser());

// Enable CORS with credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies
  })
);

app.use("/api/school", schoolRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/email', emailRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
