import {
  FaChartPie,
  FaBoxOpen,
  FaBookOpen,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

// You can swap to other chart libs if you like. Here we use recharts for variety.
const API = import.meta.env.VITE_OPEN_APIURL;

const COLORS = ["#6366f1", "#22d3ee", "#f59e42", "#8b5cf6", "#10b981"];

export default function Dashboard() {
  // Using TanStack Query for all stats
  const results = useQueries({
    queries: [
      {
        queryKey: ["products"],
        queryFn: async () => {
          const res = await axios.get(`${API}/api/shopping/products`);
          return res.data;
        },
      },
      {
        queryKey: ["articles"],
        queryFn: async () => {
          const res = await axios.get(`${API}/api/articles`);
          return res.data;
        },
      },
      {
        queryKey: ["bookForms"],
        queryFn: async () => {
          const res = await axios.get(`${API}/api/book-form`);
          return res.data;
        },
      },
      {
        queryKey: ["users"],
        queryFn: async () => {
          try {
            const res = await axios.get(`${API}/api/users`);
            return res.data;
          } catch {
            return [];
          }
        },
      },
    ],
  });

  const [products, articles, bookForms, users] = results.map(
    (q) => q.data || []
  );
  const isLoading = results.some((q) => q.isLoading);

  const pieData = [
    { name: "Products", value: products.length },
    { name: "Articles", value: articles.length },
    { name: "Book Forms", value: bookForms.length },
    { name: "Users", value: users.length },
  ];

  // Example: Recent growth, static demo data. Replace with your own if you have it.
  const barData = [
    {
      name: "Products",
      value: products.length,
      growth: Math.round(products.length * 0.1 + 2), // Fake growth
    },
    {
      name: "Articles",
      value: articles.length,
      growth: Math.round(articles.length * 0.1 + 1),
    },
    {
      name: "Book Forms",
      value: bookForms.length,
      growth: Math.round(bookForms.length * 0.1 + 1),
    },
    {
      name: "Users",
      value: users.length,
      growth: Math.round(users.length * 0.13 + 3),
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col xl:flex-row gap-8 p-6 bg-gradient-to-br from-slate-950 to-slate-800 transition-all">
      {/* Main dashboard area */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Welcome & stats */}
        <div className="relative flex flex-col md:flex-row gap-8 items-stretch">
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-slate-900/90 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex gap-4 flex-wrap">
                  <WidgetStat
                    icon={<FaBoxOpen className="text-blue-400" />}
                    label="Products"
                    value={isLoading ? "..." : products.length}
                  />
                  <WidgetStat
                    icon={<FaFileAlt className="text-orange-400" />}
                    label="Articles"
                    value={isLoading ? "..." : articles.length}
                  />
                  <WidgetStat
                    icon={<FaBookOpen className="text-green-400" />}
                    label="Book Forms"
                    value={isLoading ? "..." : bookForms.length}
                  />
                  <WidgetStat
                    icon={<FaUsers className="text-yellow-400" />}
                    label="Users"
                    value={isLoading ? "..." : users.length}
                  />
                </div>
                <div className="mt-6">
                  <div className="text-lg text-gray-100 font-bold flex items-center gap-2">
                    <FaChartPie className="text-indigo-500" />
                    Dashboard Overview
                  </div>
                  <div className="text-gray-400 mt-1 text-sm max-w-xl">
                    Welcome to the Faizy-Legend Admin Dashboard. Manage shop,
                    articles, book forms, and users with powerful tools and
                    modern UI. Key data always at a glance!
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 xl:w-96 h-64 flex flex-col items-center">
                <div className="font-semibold text-indigo-300 mb-2">
                  Distribution
                </div>
                {isLoading ? (
                  <div className="h-[200px] flex items-center justify-center w-full text-gray-400">
                    Loading...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="95%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          percent > 0.14 ? `${name}` : ""
                        }
                        paddingAngle={2}
                        stroke="#1e293b"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {pieData.map((item, i) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-gray-300">{item.name}</span>
                      <span className="ml-1 font-semibold text-indigo-200">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Growth/Trends Bar Chart */}
            <div className="bg-slate-900/90 rounded-2xl shadow-xl p-6">
              <div className="font-semibold text-indigo-300 mb-2">
                Recent Growth
              </div>
              <div className="w-full h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#6366f1"
                      name="Total"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="growth"
                      fill="#22d3ee"
                      name="Recent Growth"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Quick Summary */}
      <aside className="w-full xl:w-72 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-slate-900/90 rounded-2xl shadow-xl p-6">
          <div className="font-extrabold text-2xl tracking-tight mb-4 text-indigo-300">
            Quick Summary
          </div>
          <ul className="space-y-3">
            <SidebarStat
              icon={<FaBoxOpen className="text-blue-400" />}
              label="Products"
              value={isLoading ? "..." : products.length}
            />
            <SidebarStat
              icon={<FaFileAlt className="text-orange-400" />}
              label="Articles"
              value={isLoading ? "..." : articles.length}
            />
            <SidebarStat
              icon={<FaBookOpen className="text-green-400" />}
              label="Book Forms"
              value={isLoading ? "..." : bookForms.length}
            />
            <SidebarStat
              icon={<FaUsers className="text-yellow-400" />}
              label="Users"
              value={isLoading ? "..." : users.length}
            />
          </ul>
        </div>
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-500 to-teal-400 rounded-2xl shadow-xl px-6 py-4 mt-6 flex flex-col items-center">
          <span className="text-white font-bold text-lg">faizy-legend</span>
          <span className="text-gray-200 text-xs mt-1 tracking-wide">
            Admin System
          </span>
        </div>
      </aside>
    </div>
  );
}

function WidgetStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3 shadow text-gray-200 min-w-[120px]">
      <span className="text-2xl">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
}

function SidebarStat({ icon, label, value }) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-800">
      <span className="text-xl">{icon}</span>
      <span className="text-gray-200 font-medium">{label}</span>
      <span className="ml-auto font-semibold text-indigo-200">{value}</span>
    </li>
  );
}
