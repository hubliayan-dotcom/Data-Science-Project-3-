import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { EmployeeData, PredictionResult } from "../lib/types";
import { Brain, Send, Loader2, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { cn } from "../lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function PredictorView() {
  const [formData, setFormData] = useState<EmployeeData>({
    age: 30,
    experience_years: 5,
    department: "Engineering",
    job_level: "Mid",
    training_hours: 20,
    on_time_delivery_rate: 0.85,
    manager_score: 4,
    peer_feedback_score: 4,
    sick_days: 2,
    projects_count: 3,
    certifications_count: 1,
    avg_task_delay_days: 1.5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "department" || name === "job_level" ? value : Number(value)
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Evaluate the following employee data: ${JSON.stringify(formData)}.
        Predict their performance band (High, Medium, Low) for the next appraisal cycle.
        Provide probability scores for each band, top 3 drivers for this prediction, and 3-4 specific coaching recommendations in markdown format.`,
        config: {
          systemInstruction: "You are an HR Data Scientist specializing in Employee Performance Prediction. Evaluate the provided employee metrics and output a structured prediction.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictedBand: { type: Type.STRING, description: "One of High, Medium, Low" },
              probabilities: {
                type: Type.OBJECT,
                properties: {
                  High: { type: Type.NUMBER },
                  Medium: { type: Type.NUMBER },
                  Low: { type: Type.NUMBER }
                }
              },
              topDrivers: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Actionable coaching recommendations"
              }
            },
            required: ["predictedBand", "probabilities", "topDrivers", "recommendations"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate prediction. Please ensure the Gemini API key is configured correctly.");
    } finally {
      setIsLoading(false);
    }
  };

  const bandStyles = {
    High: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const BandIcon = {
    High: CheckCircle2,
    Medium: TrendingUp,
    Low: AlertCircle,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Brain className="text-blue-600" />
              Employee Parameters
            </h3>
            
            <form onSubmit={handlePredict} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-secondary">Department</label>
                  <select 
                    name="department" 
                    value={formData.department} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink-secondary">Job Level</label>
                  <select 
                    name="job_level" 
                    value={formData.job_level} 
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                    <option>Lead</option>
                  </select>
                </div>
              </div>

              {[
                { label: "Age", name: "age", min: 18, max: 70 },
                { label: "Experience (Years)", name: "experience_years", min: 0, max: 50 },
                { label: "Training Hours", name: "training_hours", min: 0, max: 200 },
                { label: "On-Time Rate (0-1)", name: "on_time_delivery_rate", min: 0, max: 1, step: 0.01 },
                { label: "Manager Score (1-5)", name: "manager_score", min: 1, max: 5 },
                { label: "Peer Score (1-5)", name: "peer_feedback_score", min: 1, max: 5 },
                { label: "Sick Days", name: "sick_days", min: 0, max: 100 },
                { label: "Projects Count", name: "projects_count", min: 1, max: 20 },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-ink-secondary">{field.label}</label>
                    <span className="text-xs font-mono font-bold text-blue-600">{(formData as any)[field.name]}</span>
                  </div>
                  <input
                    type="range"
                    name={field.name}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    value={(formData as any)[field.name]}
                    onChange={handleInputChange}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Predict Performance
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
              <AlertCircle />
              <p>{error}</p>
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center opacity-60">
              <Brain size={64} className="text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-ink-secondary">Ready for Prediction</h4>
              <p className="text-sm text-ink-secondary max-w-xs mt-2">Adjust the parameters and click the button to generate an AI-powered appraisal forecast.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              {/* Prediction Band */}
              <div className={cn("p-8 rounded-2xl border-2 flex flex-col items-center text-center", bandStyles[result.predictedBand as keyof typeof bandStyles])}>
                {(() => {
                  const Icon = BandIcon[result.predictedBand as keyof typeof BandIcon];
                  return <Icon size={48} className="mb-4" />;
                })()}
                <p className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80">Predicted Performance Band</p>
                <h2 className="text-5xl font-black">{result.predictedBand}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Confidence Scores */}
                <div className="dashboard-card">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-ink-secondary mb-4">Confidence Breakdown</h4>
                  <div className="space-y-4">
                    {Object.entries(result.probabilities).map(([band, prob]) => (
                      <div key={band} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>{band}</span>
                          <span>{(Number(prob) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              band === "High" ? "bg-emerald-500" : band === "Medium" ? "bg-amber-500" : "bg-rose-500"
                            )}
                            style={{ width: `${Number(prob) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Drivers */}
                <div className="dashboard-card">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-ink-secondary mb-4">Top Drivers</h4>
                  <ul className="space-y-3">
                    {result.topDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-ink-primary leading-tight">{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="dashboard-card">
                <h4 className="text-sm font-bold uppercase tracking-wider text-ink-secondary mb-4">Coaching Recommendations</h4>
                <div className="prose prose-sm prose-slate max-w-none">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-ink-primary">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
