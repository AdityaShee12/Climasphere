import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import weatherRouter from "./routes/weatherData.routes.js"
import insightRouter from "./routes/insight.routes.js";
import { FRONTEND_API } from "./Frontend_API.js";

const app = express();

app.use(
  cors({
    origin: FRONTEND_API,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet()); // includes X-Content-Type-Options: nosniff
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware Setup
app.use(cors({ origin: FRONTEND_API, methods: ["GET", "POST"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT" || req.method === "UPDATE" || req.method === "DELETE") &&
    !req.is("application/json") &&
    !req.is("multipart/form-data")
  ) {
    return res.status(415).json({ message: "Invalid content type" });
  }
  next();
});

app.use("/api", (req, res, next) => {
  res.type("application/json");
  next();
});

// ======================
// 🚀 API Routes
// ======================
app.get("/", (req, res) => {
  res.type("text/plain");
  res.send("API is running successfully");
});

app.use("/auth", authRoutes);
app.use("/weather", weatherRouter);
app.use("/insight", insightRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ⚠️ Error Handler
const errorHandler = (
  err,
  req,
  res,
  next
) => {
  const statusCode =
    err.statusCode || 500;
  const message =
    err.message ||
    "Internal Server Error";
  return res
    .status(statusCode)
    .json({
      success: false,
      message,
      errors:
        err.errors || [],
    });
};

app.use(errorHandler);

export { app };