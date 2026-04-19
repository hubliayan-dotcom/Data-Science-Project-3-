import fs from 'fs';
import path from 'path';

const n = 1000;
const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing'];
const levels = ['Junior', 'Mid', 'Senior', 'Lead'];

const data = [];
for (let i = 0; i < n; i++) {
  const otd = Math.random();
  const mgr = Math.floor(Math.random() * 5) + 1;
  const peer = Math.floor(Math.random() * 5) + 1;
  const training = Math.floor(Math.random() * 100);
  const projects = Math.floor(Math.random() * 10) + 1;
  const certs = Math.floor(Math.random() * 5);
  const sick = Math.floor(Math.random() * 10);
  const delay = Math.random() * 10;
  
  // Score formula
  const score = (otd * 30) + (mgr * 8) + (peer * 6) + (training * 0.3) + (projects * 1.5) + (certs * 2) - (sick * 0.8) - (delay * 1.5) + (Math.random() * 5);
  
  let band = "Medium";
  if (score > 65) band = "High";
  else if (score < 35) band = "Low";

  data.push({
    employee_id: 1001 + i,
    age: Math.floor(Math.random() * 40) + 22,
    experience_years: Math.floor(Math.random() * 30),
    department: departments[Math.floor(Math.random() * departments.length)],
    job_level: levels[Math.floor(Math.random() * levels.length)],
    training_hours: training,
    on_time_delivery_rate: otd.toFixed(3),
    manager_score: mgr,
    peer_feedback_score: peer,
    sick_days: sick,
    projects_count: projects,
    certifications_count: certs,
    avg_task_delay_days: delay.toFixed(1),
    perf_band_next: band
  });
}

const csvHeader = Object.keys(data[0]).join(',');
const csvRows = data.map(row => Object.values(row).join(','));
const csvContent = [csvHeader, ...csvRows].join('\n');

if (!fs.existsSync('./data')) fs.mkdirSync('./data');
fs.writeFileSync('./data/employee_features.csv', csvContent);
console.log("Dataset generated.");
