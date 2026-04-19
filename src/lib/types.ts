export type PerformanceBand = "High" | "Medium" | "Low";

export interface EmployeeData {
  age: number;
  experience_years: number;
  department: string;
  job_level: string;
  training_hours: number;
  on_time_delivery_rate: number;
  manager_score: number;
  peer_feedback_score: number;
  sick_days: number;
  projects_count: number;
  certifications_count: number;
  avg_task_delay_days: number;
}

export interface PredictionResult {
  predictedBand: PerformanceBand;
  probabilities: {
    High: number;
    Medium: number;
    Low: number;
  };
  recommendations: string[];
  topDrivers: string[];
}
