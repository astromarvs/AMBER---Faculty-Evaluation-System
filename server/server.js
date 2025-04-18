const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const schoolRoutes = require("./routes/schoolRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emailRoutes = require("./routes/emailRoutes")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
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
app.use('/api/email', emailRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

