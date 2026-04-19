import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { RandomForestClassifier } from "ml-random-forest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load trained model
  let model: RandomForestClassifier | null = null;
  try {
    const modelData = JSON.parse(fs.readFileSync(path.join(__dirname, "models/employee_perf_model.json"), "utf8"));
    model = RandomForestClassifier.load(modelData);
    console.log("ML Model loaded successfully.");
  } catch (e) {
    console.error("Failed to load ML model, ensure training has run.");
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/predict", (req, res) => {
    if (!model) {
      return res.status(500).json({ error: "Model not loaded" });
    }

    const { 
      age, experience_years, department, job_level, training_hours, 
      on_time_delivery_rate, manager_score, peer_feedback_score, 
      sick_days, projects_count, certifications_count, avg_task_delay_days 
    } = req.body;

    const deptMap: Record<string, number> = { 'Engineering': 0, 'Sales': 1, 'HR': 2, 'Finance': 3, 'Marketing': 4 };
    const levelMap: Record<string, number> = { 'Junior': 0, 'Mid': 1, 'Senior': 2, 'Lead': 3 };

    const features = [
      age,
      experience_years,
      deptMap[department] || 0,
      levelMap[job_level] || 0,
      training_hours,
      on_time_delivery_rate,
      manager_score,
      peer_feedback_score,
      sick_days,
      projects_count,
      certifications_count,
      avg_task_delay_days
    ];

    const predictionIdx = model.predict([features])[0];
    const probas = (model as any).predictProbability([features])[0];
    const bands = ["Low", "Medium", "High"];

    res.json({
      predictedBand: bands[predictionIdx],
      probabilities: {
        Low: probas[0] || 0,
        Medium: probas[1] || 0,
        High: probas[2] || 0
      }
    });
  });

  // Mock historical data for the dashboard
  app.get("/api/analytics", (req, res) => {
    let metrics = {};
    try {
      metrics = JSON.parse(fs.readFileSync(path.join(__dirname, "models/metrics.json"), "utf8"));
    } catch (e) {}

    res.json({
      summary: {
        totalEmployees: 1000,
        highPerformers: 220,
        mediumPerformers: 580,
        lowPerformers: 200,
      },
      metrics,
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
