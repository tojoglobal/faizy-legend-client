import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const API = import.meta.env.VITE_OPEN_APIURL;

export default function BookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();

  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("message", data.message);

    // Only append file if present (only one file allowed for DB)
    if (files.length > 0) {
      formData.append("files", files[0]);
    }

    try {
      await axios.post(`${API}/api/book-form`, formData);
      setSubmitStatus("success");
      setSubmitMessage("Your submission was successful.");
      reset();
      setFiles([]);
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        error.message || "Something went wrong. Please try again later."
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 0) {
      const invalidFile = selectedFiles.find(
        (file) => !ALLOWED_FILE_TYPES.includes(file.type)
      );

      if (invalidFile) {
        setFileError("Only .png, .jpg, and .pdf files are allowed.");
        setError("files", { type: "manual", message: "Invalid file type." });
        setFiles([]);
        return;
      }
    }

    setFileError(null);
    clearErrors("files");
    setFiles(selectedFiles.slice(0, 1)); // only one file!
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl font-poppins mx-auto w-full px-2 py-10 bg-[#181818] flex flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            placeholder="Name"
            className="bg-transparent border font-normal placeholder:font-normal border-white text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            placeholder="Last Name"
            className="bg-transparent border font-normal placeholder:font-normal border-white text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-transparent border font-normal placeholder:font-normal border-white text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <textarea
          placeholder="Message"
          className="w-full bg-transparent font-normal placeholder:font-normal border border-white text-white placeholder-gray-400 rounded-md px-4 py-3 min-h-[120px] focus:outline-none resize-none"
          {...register("message", { required: "Message is required" })}
        />
        {errors.message && (
          <span className="text-red-500 text-xs mt-1">
            {errors.message.message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="fileUpload" className="relative cursor-pointer flex">
          <button
            type="button"
            className="h-9 px-3 cursor-pointer bg-white text-black hover:bg-gray-200 transition-colors"
            onClick={() => document.getElementById("fileUpload").click()}
          >
            Choose File
          </button>
          <div className="flex-1 h-9 bg-transparent flex items-center px-4">
            <span className="text-white">
              {files.length > 0 ? files[0].name : "No file chosen"}
            </span>
          </div>
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
          />
        </label>
        {fileError && (
          <span className="text-red-500 text-xs mt-1">{fileError}</span>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-transparent border font-medium border-white text-white tracking-widest py-3 rounded-md transition cursor-pointer"
      >
        SUBMIT
      </button>
      {submitStatus && (
        <div className="flex items-center gap-2">
          {submitStatus === "success" ? (
            <FaCheckCircle className="text-green-500 text-xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-xl" />
          )}
          <span
            className={`text-sm ${
              submitStatus === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {submitMessage}
          </span>
        </div>
      )}
    </form>
  );
}
