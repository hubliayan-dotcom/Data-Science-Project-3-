import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

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

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
  const pieData = [
    { name: "High", value: data.summary.highPerformers },
    { name: "Medium", value: data.summary.mediumPerformers },
    { name: "Low", value: data.summary.lowPerformers },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
      <div className="dashboard-card">
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
    </div>
  );
}
