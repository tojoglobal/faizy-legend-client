import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { AppProvider } from "./context/AppContext";
import Home from "./Home/Home";
import DashboardLayout from "./Dashboard/Layout/Layout";
import Dashboard from "./Dashboard/Dashboard";
import ErrorPage from "./Err/Error";
import Gallery from "./Section/Content/Modeling/gallery/Gallery";

const AppLayout = () => {
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/gallery/:title" element={<Gallery />} />
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
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="relative">
          <AppLayout />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
