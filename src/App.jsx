import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { AppProvider } from "./Components/context/AppContext";
import Home from "./Pages/Home/Home";
import AdminLogin from "./Dashboard/admin/AdminLogin";
import AddFanArt from "./Pages/Fanart/AddFanArt";
import Fanart from "./Pages/Fanart/Fanart";
import Gallery from "./Section/Content/Modeling/gallery/Gallery";
import FaizyComic from "./Pages/FaizyComic/FaizyComic";
import DashboardLayout from "./Dashboard/DashboardLayout/DashboardLayout";
import Dashboard from "./Dashboard/Dashboard";
import AdminUpdateFilmingGallery from "./Dashboard/AdminUpdate/AdminUpdateFilmingGallery";
import AdminFanArt from "./Pages/Fanart/AdminFanArt";
import ModelingGalleryTable from "./Dashboard/ModelingGallery/ModelingGalleryTable";
import UgcGallery from "./Dashboard/UgcGallery/UgcGallery";
import AdminUpdateShopping from "./Dashboard/AdminUpdate/AdminUpdateShopping";
import AdminBookingData from "./Dashboard/AdminUpdate/AdminBookingData";
import AdminUpdateArticles from "./Dashboard/AdminUpdate/AdminUpdateArticles";
import ErrorPage from "./Pages/Err/Error";
import { ScrollProvider } from "./Components/context/ScrollContext";
import AdminFaizyComic from "./Pages/FaizyComic/AdminFaizyComic";
import AllComics from "./Pages/FaizyComic/AllComics";
import ComicLayout from "./Pages/FaizyComic/ComicLayout";
import AdminIGComics from "./Pages/FaizyComic/AdminIGComics";

const AppLayout = () => {
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/add-fanart" element={<AddFanArt />} />
      <Route path="/fanart" element={<Fanart />} />
      <Route path="/gallery/:title" element={<Gallery />} />
      <Route path="/faizycomic" element={<ComicLayout />}>
        <Route path="/faizycomic" element={<FaizyComic />} />
        <Route path="comics" element={<AllComics />} />
      </Route>
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
        <Route path="fanart" element={<AdminFanArt />} />
        <Route path="faizycomic" element={<AdminFaizyComic />} />
        <Route path="faizy/ig-comics" element={<AdminIGComics />} />
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
