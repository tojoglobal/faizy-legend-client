/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ProtectedRoute = ({ children }) => {
  const axiosPublicUrl = useAxiospublic();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axiosPublicUrl
      .get("/admin/dashboard")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  // if (isAuth === null) return <p>Loading...</p>;
  if (isAuth === null)
    return (
      <div className="flex bg-black justify-center h-screen items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b6d7f]"></div>
      </div>
    );
  return isAuth ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
