import {
  FaChartPie,
  FaBoxOpen,
  FaBookOpen,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

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
          // You may need to implement this endpoint on the backend
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

  return (
    <div className="min-h-[75vh] flex flex-col md:flex-row items-stretch gap-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Left: Menu */}
      <div className="w-full md:w-1/3 xl:w-1/4 flex-shrink-0 flex flex-col gap-6">
        <div className="rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6 text-indigo-300">
            Admin Shortcuts
          </h2>
          <div className="space-y-3">
            <DashLink
              icon={<FaBoxOpen />}
              to="/dashboard/shopping"
              label="Manage Products"
            />
            <DashLink
              icon={<FaFileAlt />}
              to="/dashboard/articles"
              label="Manage Articles"
            />
            <DashLink
              icon={<FaBookOpen />}
              to="/dashboard/booking-data"
              label="Manage Book Forms"
            />
            <DashLink
              icon={<FaUsers />}
              to="/dashboard/users"
              label="User Management"
            />
          </div>
        </div>
        <div className="hidden md:block bg-slate-900/80 rounded-xl shadow-md px-6 py-4 mt-8">
          <span className="text-gray-400 text-xs">
            faizy-legend admin system
          </span>
        </div>
      </div>
      {/* Right: Pie chart and stats */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="bg-slate-900/80 rounded-xl shadow-md w-full max-w-xs flex flex-col items-center p-6">
            <h3 className="text-xl font-bold text-indigo-300 mb-2">Overview</h3>
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center w-full text-gray-400">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent > 0.14 ? `${name}` : ""
                    }
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
            <div className="mt-4 flex flex-col gap-1 w-full">
              {pieData.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-gray-300">{item.name}</span>
                  <span className="ml-auto font-semibold text-indigo-200">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-md flex flex-col gap-6">
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
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-slate-900/80 rounded-xl shadow-md p-6 w-full flex flex-col items-center">
            <FaChartPie className="w-10 h-10 text-indigo-500 mb-3" />
            <div className="text-lg text-gray-200 font-semibold">
              Welcome to the Faizy-Legend Admin Dashboard
            </div>
            <div className="text-gray-400 text-center mt-2 text-sm max-w-lg">
              Manage your shop, articles, book forms, and users with powerful
              tools and a modern UI. Use the sidebar for quick navigation and
              see all key data at a glance!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashLink({ icon, to, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-teal-600 transition text-gray-200 hover:text-white font-medium"
    >
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}

function WidgetStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-4 shadow text-gray-200">
      <span className="text-2xl">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
}
