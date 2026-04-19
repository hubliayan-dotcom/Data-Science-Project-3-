# Employee Performance Predictor 📊
### Using Data Analytics & Machine Learning to Forecast Workforce Productivity

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)

---

## 1. Project Overview & Business Value

### What Is Employee Performance Prediction?
This project is a data-driven system that uses historical behavioral and productivity signals (training hours, delivery rates, manager scores, etc.) to forecast an employee's next appraisal performance band — **High, Medium, or Low** — before the actual review cycle.

### Why Companies Need This
*   **Reduced Bias:** ML-assisted analytics help reduce appraisal bias common in traditional qualitative reviews.
*   **Proactive Intervention:** Early identification of "Low" performers allows HR to design targeted Learning & Development (L&D) plans.
*   **Budget Optimization:** Target L&D budgets toward people who actually need intervention.
*   **Promotion Readiness:** Fairly surface high performers across diverse departments.

---

## 2. Tech Stack & Architecture

### Frontend
*   **React 19 / Vite:** For a blazing fast, modern development environment.
*   **Tailwind CSS:** For custom "Technical Dashboard" styling.
*   **Recharts:** For data-dense information visualization.
*   **Lucide React:** For consistent, high-quality iconography.
*   **Motion (Framer Motion):** For smooth view transitions and animations.

### AI & Backend
*   **Express.js:** Serving API routes and managing the Vite middleware logic.
*   **Google Gemini 3 Flash:** Powering the predictive engine via the `@google/genai` TypeScript SDK.
*   **Typed Schema Logic:** Enforcing rigorous JSON structures for AI-generated outputs.

### Architecture Workflow
`Raw Metrics Input` → `Frontend Validation` → `Gemini AI Analysis` → `Structured Prediction JSON` → `Dashboard Visualization`

---

## 3. Professional Folder Structure

```text
Employee-Performance-Predictor/
├── server.ts              # Full-stack Express entry point
├── package.json           # Dependencies & scripts
├── metadata.json          # App configuration
├── src/
│   ├── App.tsx            # Navigation & Layout
│   ├── components/
│   │   ├── DashboardView.tsx   # Analytics & Charts
│   │   └── PredictorView.tsx   # AI Prediction Form
│   ├── lib/
│   │   ├── types.ts       # Global TypeScript Interfaces
│   │   └── utils.ts       # Tailwind merging helpers (cn)
│   ├── index.css          # Global styles & @theme
│   └── main.tsx           # React mounting point
└── README.md              # Documentation
```

---

## 4. Implementation Phases — 10 Days

1.  **Day 1: Setup & Environment:** Install dependencies, create virtual environment (modeled via package.json), and set up the Vite + Express foundation.
2.  **Day 2: Dataset Logic:** Defined the 12+ features that simulate a realistic HR environment.
3.  **Day 3: Data Cleaning & Validation:** Implementation of form validation and data type handling in the Predictor UI.
4.  **Day 4: Exploratory Analysis:** Creation of the Dashboard statistics and visualization logic using Recharts.
5.  **Day 5: Feature Engineering:** Development of the `lib/types.ts` and `PredictorView` state logic.
6.  **Day 6: AI Model Integration:** Connecting the frontend to Gemini 3 Flash for zero-shot performance classification.
7.  **Day 7: Logic Evaluation:** Testing the prompt efficiency and refining the `responseSchema` for consistent results.
8.  **Day 8: Explainability:** Adding "Top Drivers" to the results UI to ensure HR transparency.
9.  **Day 9: Dashboard Finalization:** Completing the Department and Trend charts.
10. **Day 10: Documentation:** Finalizing refined coaching recommendation rules.

---

## 5. Interview Preparation — 10 Q&As

**Q1: What is the problem statement of your project?**  
We predict an employee's next appraisal performance band — High, Medium, or Low — using behavioral and productivity signals collected over 6-12 months. The goal is to help HR teams identify at-risk employees early and plan targeted L&D interventions.

**Q2: Why did you choose Gemini/AI over a simple regression model?**  
While regression works for linear trends, Gemini captures non-linear relationships and semantic context (like the interplay between job level and training hours) while providing qualitative coaching text that traditional models lack.

**Q3: How did you handle class imbalance in your logic?**  
By using `responseSchema` with probability weighting, we ask the AI to evaluate the likelihood of each band, ensuring that a "Low" performer isn't ignored just because most employees are "Medium."

**Q4: What is the significance of the Confidence Probability?**  
It reveals how certain the model is. A 51% "High" prediction signals to HR that the employee is on the border and may need just a slight push to reach peak performance.

**Q5: What is label leakage and how did you prevent it?**  
Leakage occurs when future info (like an actual appraisal score) is used as a predictor. We only use behavioral signals available *before* the appraisal cycle to ensure valid forecasting.

**Q6: Explain your data pipeline.**  
React UI collects metrics → Validated state is sent as context → Gemini evaluates context against HR logic → Structured JSON is parsed and rendered.

**Q7: How do you identify the "Top Drivers"?**  
We prompt the AI to perform a recursive evaluation: identifying which metrics, if changed, would most shift the predicted band.

**Q8: How would this system be used in a real company?**  
Two months before reviews, HRBP logs in, uploads (or inputs) employee data, and uses the AI breakdown to prepare manager coaching scripts.

**Q9: What are the ethical risks?**  
Key risks include bias amplification and privacy. We mitigate these by excluding demographic identifiers (like gender) from the predictor logic and providing transparency via "Drivers."

**Q10: What would you improve with more time?**  
Adding automated drift monitoring and integrating with live HRMS platforms like SAP or Workday.

---

## 7. How to Run Locally

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set your API Key: Create a `.env` file and add `GEMINI_API_KEY="your_key_here"`.
4.  Launch development server: `npm run dev`
5.  Access via: `http://localhost:3000`

---

## 8. Future Improvements
*   **Real-time HRMS Integration:** Connect directly to Workday or SAP APIs.
*   **Sentiment Analysis:** Integrate peer feedback text analysis using Gemini's multimodal capabilities.
*   **Attrition Risk:** Add a secondary model to predict the likelihood of an employee leaving the company.

---

*Built with ❤️ for People Analytics Pioneers.*
