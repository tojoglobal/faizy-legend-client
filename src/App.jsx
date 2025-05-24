import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { AppProvider } from "./context/AppContext";
import Home from "./Home/Home";
import DashboardLayout from "./Dashboard/Layout/Layout";
import Dashboard from "./Dashboard/Dashboard";

const AppLayout = () => {
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}

export default App;
