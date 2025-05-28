import React, { useState } from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import "./adminlogin.css";
import { useAxiospublic } from "./../Hooks/useAxiospublic";
import { usePasswordToggle } from "./../utils/usePasswordToggle";

const AdminLogin = () => {
  const axiosPublicUrl = useAxiospublic();
  const navigate = useNavigate();

  const [passwordType, ToggleIcon] = usePasswordToggle();
  // form data
  const [formData, setFormData] = useState({
    useremail: "",
    password: "",
  });

  //input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { useremail, password } = formData;
    try {
      const response = await axiosPublicUrl.post("/admin/adminlogin", {
        email: useremail,
        password: password,
      });
      const data = response.data;

      if (data.success) {
        localStorage.setItem("userEmail", JSON.stringify({ useremail }));
        navigate("/dashboard");
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log("Login failed:", data.message);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: data.message || "Invalid username or password",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again!",
      });
    }
  };

  return (
    <form action="" method="post" id="adminLogin" onSubmit={handleSubmit}>
      <div className="left hidden md:block">
        <div className="w-[80%]">
          <p className="mb-2">Hello, Welcome!</p>
          <p className="text-center text-gray-200">
            waiting for your <span className="font-semibold">Login</span>
          </p>
        </div>
      </div>
      <div className="right md:w-1/2 w-full">
        <div>
          <h1>Login</h1>
          <input
            type="email"
            value={formData.useremail}
            onChange={handleChange}
            name="useremail"
            id="useremail"
            placeholder="Write your email"
          />
          <span className="material-symbols-outlined person">
            <MdEmail />
          </span>

          <input
            type={passwordType}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="material-symbols-outlined cursor-pointer lock">
            {ToggleIcon}
          </span>

          <button type="submit">Login</button>
          <p>or login with social platforms</p>
          <div>
            <a href="">
              <FcGoogle />
            </a>
            <a href="">
              <FaFacebook className="text-[#1877F2]" />
            </a>
            <a href="">
              <FaLinkedin className="text-[#0A66C2]" />
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminLogin;
