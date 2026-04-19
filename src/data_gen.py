import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

df = pd.DataFrame({
    'employee_id':           range(1001, 1001 + n),
    'age':                   np.random.randint(22, 60, n),
    'experience_years':      np.random.randint(0, 35, n),
    'department':            np.random.choice(
                               ['Engineering','Sales','HR','Finance','Marketing'], n),
    'job_level':             np.random.choice(
                               ['Junior','Mid','Senior','Lead'], n,
                               p=[0.3, 0.4, 0.2, 0.1]),
    'training_hours':        np.random.poisson(20, n).clip(0, 100),
    'on_time_delivery_rate': np.random.beta(7, 3, n).round(3),
    'manager_score':         np.random.choice([1,2,3,4,5], n,
                               p=[0.05, 0.10, 0.30, 0.35, 0.20]),
    'peer_feedback_score':   np.random.choice([1,2,3,4,5], n,
                               p=[0.05, 0.10, 0.30, 0.35, 0.20]),
    'sick_days':             np.random.poisson(4, n).clip(0, 30),
    'projects_count':        np.random.randint(1, 12, n),
    'certifications_count':  np.random.poisson(1.5, n).clip(0, 10),
    'avg_task_delay_days':   np.random.exponential(2, n).round(1),
    'billable_hours_ratio':  np.random.beta(6, 2, n).round(3),
    'kudos_count':           np.random.poisson(5, n).clip(0, 30),
    'promotions_in_2y':      np.random.choice([0, 1, 2], n, p=[0.7, 0.25, 0.05]),
    'gender':                np.random.choice(['M','F','Other'], n,
                               p=[0.52, 0.44, 0.04]),
})

# Performance scoring logic
score = (
    df['on_time_delivery_rate'] * 30 
  + df['manager_score'] * 8
  + df['peer_feedback_score'] * 6
  + df['training_hours'] * 0.3
  + df['projects_count'] * 1.5
  + df['certifications_count'] * 2
  + df['kudos_count'] * 0.5
  - df['sick_days'] * 0.8
  - df['avg_task_delay_days'] * 1.5
  + np.random.normal(0, 5, n)
)

df['perf_band_next'] = pd.cut(score, bins=3, labels=['Low', 'Medium', 'High'])
df.to_csv('data/employee_features.csv', index=False)
