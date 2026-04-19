import { useEffect, useState, Fragment } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Users, TrendingUp, AlertTriangle, CheckCircle, Brain } from "lucide-react";
import { cn } from "../lib/utils";

export default function DashboardView() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-ink-secondary">Loading analytics...</div>;

  const summaryStats = [
    { label: "Total Employees", value: data.summary.totalEmployees, icon: Users, color: "text-blue-600" },
    { label: "High Performers", value: data.summary.highPerformers, icon: CheckCircle, color: "text-high" },
    { label: "Medium Band", value: data.summary.mediumPerformers, icon: TrendingUp, color: "text-medium" },
    { label: "Low Band (At Risk)", value: data.summary.lowPerformers, icon: AlertTriangle, color: "text-low" },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"]; // Low, Med, High
  const pieData = [
    { name: "Low", value: data.summary.lowPerformers },
    { name: "Medium", value: data.summary.mediumPerformers },
    { name: "High", value: data.summary.highPerformers },
  ];

  const confusionMatrix = data.metrics?.confusion_matrix || [[0,0,0],[0,0,0],[0,0,0]];
  const accuracy = data.metrics?.accuracy || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ML Performance Banner */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Random Forest Classifier Active</h2>
            <p className="text-blue-100 text-sm">Model trained on 1,000 synthetic employee records.</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Model Accuracy</p>
          <p className="text-4xl font-black">{(accuracy * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="dashboard-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value mt-1">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Breakdown */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-6">Performance by Department</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="high" name="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medium" name="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="low" name="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-6">Overall Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 dashboard-card">
          <h3 className="text-lg font-semibold mb-6">Average Performance Trend (Last 6 Months)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Top Predictors
            <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded uppercase">Feature Importance</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.metrics?.feature_importance?.slice(0, 6) || []}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Weight']}
                />
                <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Section */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Confusion Matrix (Test Set Evaluation)
          <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded uppercase">ML Verification</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
              <div />
              {['Pred Low', 'Pred Med', 'Pred High'].map(l => (
                <div key={l} className="text-[10px] font-bold text-center text-ink-secondary">{l}</div>
              ))}
              
              {['Act Low', 'Act Med', 'Act High'].map((l, i) => (
                <Fragment key={l}>
                  <div className="text-[10px] font-bold flex items-center justify-end text-ink-secondary pr-2">{l}</div>
                  {confusionMatrix[i]?.map((val: number, j: number) => (
                    <div 
                      key={`${i}-${j}`} 
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center font-mono font-bold text-sm",
                        i === j ? "bg-blue-600 text-white shadow-inner" : "bg-gray-50 text-ink-secondary border border-gray-100"
                      )}
                    >
                      {val}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm">Understanding the Matrix</h4>
            <p className="text-sm text-ink-secondary leading-relaxed">
              The diagonal cells (highlighted) represent **True Positives**, where the ML model's prediction matched the actual employee appraisal band. 
              Off-diagonal values indicate classification errors.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="stat-label">Precision</p>
                <p className="text-lg font-bold">{(data.metrics?.precision || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="stat-label">Recall</p>
                <p className="text-lg font-bold">{(data.metrics?.recall || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="stat-label">F1 Score</p>
                <p className="text-lg font-bold">{(data.metrics?.f1 || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
