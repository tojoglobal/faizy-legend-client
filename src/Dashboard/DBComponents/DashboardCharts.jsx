import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import SourceOfPurchases from "./SourceOfPurchases";
// import Map, { Marker } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardCharts = () => {
  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active Users",
        data: [20, 35, 30, 25, 45, 40, 30, 35, 40, 25, 30, 50],
        backgroundColor: "#0f766e",
      },
      {
        label: "Inactive Users",
        data: [10, 15, 20, 10, 25, 20, 15, 20, 25, 15, 20, 30],
        backgroundColor: "#2dd4bf",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="col-span-1 md:col-span-2 bg-slate-800 text-white rounded-lg p-4">
        <div className="text-xl font-semibold mb-4">Audience Metrics</div>
        <Bar data={barData} options={barOptions} />
      </div>

      <SourceOfPurchases />
    </div>
  );
};

export default DashboardCharts;