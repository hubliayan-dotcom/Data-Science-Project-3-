import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock historical data for the dashboard
  app.get("/api/analytics", (req, res) => {
    res.json({
      summary: {
        totalEmployees: 1000,
        highPerformers: 220,
        mediumPerformers: 580,
        lowPerformers: 200,
      },
      departmentDistribution: [
        { name: "Engineering", high: 65, medium: 150, low: 45 },
        { name: "Sales", high: 50, medium: 160, low: 50 },
        { name: "HR", high: 30, medium: 80, low: 30 },
        { name: "Finance", high: 45, medium: 100, low: 35 },
        { name: "Marketing", high: 30, medium: 90, low: 40 },
      ],
      performanceTrends: [
        { month: "Jan", average: 3.2 },
        { month: "Feb", average: 3.4 },
        { month: "Mar", average: 3.3 },
        { month: "Apr", average: 3.5 },
        { month: "May", average: 3.6 },
        { month: "Jun", average: 3.5 },
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
