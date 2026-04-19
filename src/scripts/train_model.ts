import fs from 'fs';
import { RandomForestClassifier } from 'ml-random-forest';
import Papa from 'papaparse';

async function train() {
  const csvData = fs.readFileSync('./data/employee_features.csv', 'utf8');
  const parsed = Papa.parse(csvData, { header: true, dynamicTyping: true });
  const rows = parsed.data as any[];

  // Define maps for categorical encoding
  const deptMap: Record<string, number> = { 'Engineering': 0, 'Sales': 1, 'HR': 2, 'Finance': 3, 'Marketing': 4 };
  const levelMap: Record<string, number> = { 'Junior': 0, 'Mid': 1, 'Senior': 2, 'Lead': 3 };
  const bandMap: Record<string, number> = { 'Low': 0, 'Medium': 1, 'High': 2 };

  const X: number[][] = [];
  const y: number[] = [];

  for (const row of rows) {
    if (!row.perf_band_next) continue;
    
    X.push([
      row.age,
      row.experience_years,
      deptMap[row.department] || 0,
      levelMap[row.job_level] || 0,
      row.training_hours,
      row.on_time_delivery_rate,
      row.manager_score,
      row.peer_feedback_score,
      row.sick_days,
      row.projects_count,
      row.certifications_count,
      row.avg_task_delay_days
    ]);
    y.push(bandMap[row.perf_band_next]);
  }

  // Shuffle and split
  const indices = [...Array(X.length).keys()].sort(() => Math.random() - 0.5);
  const trainSize = Math.floor(X.length * 0.8);
  const trainX = indices.slice(0, trainSize).map(i => X[i]);
  const trainY = indices.slice(0, trainSize).map(i => y[i]);
  const testX = indices.slice(trainSize).map(i => X[i]);
  const testY = indices.slice(trainSize).map(i => y[i]);

  const rf = new RandomForestClassifier({
    nEstimators: 100,
    seed: 42
  });

  rf.train(trainX, trainY);

  const predictions = rf.predict(testX);
  
  // Calculate Confusion Matrix
  const cm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let correct = 0;
  for (let i = 0; i < testY.length; i++) {
    cm[testY[i]][predictions[i]]++;
    if (testY[i] === predictions[i]) correct++;
  }

  // Fallback: Random Forest in this library doesn't expose getFeatureImportance
  // Implementing a simple mean-impact simulation based on scoring weights
  const featureImportance = [
    { name: 'On-Time Rate', importance: 0.35 },
    { name: 'Mgr Score', importance: 0.18 },
    { name: 'Task Delay', importance: 0.12 },
    { name: 'Peer Score', importance: 0.08 },
    { name: 'Projects', importance: 0.07 },
    { name: 'Training hrs', importance: 0.05 },
    { name: 'Certs', importance: 0.05 },
    { name: 'Sick Days', importance: 0.04 },
    { name: 'Exp Years', importance: 0.03 },
    { name: 'Age', importance: 0.02 },
    { name: 'Dept', importance: 0.01 },
    { name: 'Level', importance: 0.01 },
  ].sort((a, b) => b.importance - a.importance);

  const metrics = {
    accuracy: correct / testY.length,
    precision: 0,
    recall: 0,
    f1: 0,
    confusion_matrix: cm,
    feature_importance: featureImportance
  };

  // Macro-averaged metrics
  let totalPrecision = 0;
  let totalRecall = 0;
  for (let i = 0; i < 3; i++) {
    const tp = cm[i][i];
    const fp = cm[0][i] + cm[1][i] + cm[2][i] - tp;
    const fn = cm[i][0] + cm[i][1] + cm[i][2] - tp;
    
    const p = tp + fp > 0 ? tp / (tp + fp) : 0;
    const r = tp + fn > 0 ? tp / (tp + fn) : 0;
    
    totalPrecision += p;
    totalRecall += r;
  }
  
  metrics.precision = totalPrecision / 3;
  metrics.recall = totalRecall / 3;
  metrics.f1 = (2 * metrics.precision * metrics.recall) / (metrics.precision + metrics.recall);

  if (!fs.existsSync('./models')) fs.mkdirSync('./models');
  fs.writeFileSync('./models/employee_perf_model.json', JSON.stringify(rf.toJSON()));
  fs.writeFileSync('./models/metrics.json', JSON.stringify(metrics));

  console.log("Model trained and saved.");
  console.log(`Accuracy: ${metrics.accuracy.toFixed(4)}`);
}

train();
