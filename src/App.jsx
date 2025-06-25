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
import { ScrollProvider } from "./context/ScrollContext";
import AdminUpdateFilmingGallery from "./AdminUpdate/AdminUpdateFilmingGallery";
import AdminUpdateShopping from "./AdminUpdate/AdminUpdateShopping";
import ModelingGalleryTable from "./Dashboard/ModelingGallery/ModelingGalleryTable";
import UgcGallery from "./Dashboard/UgcGallery/UgcGallery";
import AdminBookingData from "./AdminUpdate/AdminBookingData";
import AdminUpdateArticles from "./AdminUpdate/AdminUpdateArticles";
import Fanart from "./Fanart/Fanart";

const AppLayout = () => {
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/fanart" element={<Fanart />} />
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
        <Route path="filming-gallery" element={<AdminUpdateFilmingGallery />} />
        <Route path="modeling-gallery" element={<ModelingGalleryTable />} />
        <Route path="ugc-gallery" element={<UgcGallery />} />
        <Route path="shopping" element={<AdminUpdateShopping />} />
        <Route path="booking-data" element={<AdminBookingData />} />
        <Route path="articles" element={<AdminUpdateArticles />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <ScrollProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <div className="">
            <AppLayout />
          </div>
        </Router>
      </ScrollProvider>
    </AppProvider>
  );
}

export default App;
