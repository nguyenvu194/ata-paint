import express from "express";
import cors from "cors";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import orderRoutes from "./routes/orders";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`);
  console.log(`🛒 Orders API: http://localhost:${PORT}/api/orders`);
});

export default app;
