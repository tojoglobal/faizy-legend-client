import { useState } from "react";
import {
  FiPlus,
  FiUpload,
  FiX,
  FiImage,
  FiVideo,
  FiUser,
  FiSmile,
} from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddFanArt = () => {
  const navigate = useNavigate();
  const axiospublic = useAxiospublic();
  const [user, setUser] = useState("");
  const [fanArt, setFanArt] = useState([]); // images
  const [vitiligoDance, setVitiligoDance] = useState([]); // videos
  const [vitiligoFace, setVitiligoFace] = useState([]); // 1 image
  const [message, setMessage] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Handlers for fan art (images)
  const handleFanArt = (e) => {
    let files = Array.from(e.target.files);
    setFanArt([...fanArt, ...files]);
  };
  const removeFanArt = (idx) => setFanArt(fanArt.filter((_, i) => i !== idx));

  // Handlers for vitiligo dance (videos)
  const handleDance = (e) => {
    let files = Array.from(e.target.files);
    setVitiligoDance([...vitiligoDance, ...files]);
  };
  const removeDance = (idx) =>
    setVitiligoDance(vitiligoDance.filter((_, i) => i !== idx));

  // Handler for vitiligo face (image)
  const handleFace = (e) => {
    let file = e.target.files[0];
    if (file) setVitiligoFace([file]);
  };
  const removeFace = () => setVitiligoFace([]);

  // Mutation for upload with react-query and progress bar
  const { mutate: uploadFanArt, isPending } = useMutation({
    mutationFn: async ({
      user,
      fanArt,
      vitiligoDance,
      vitiligoFace,
      agreed,
    }) => {
      setUploading(true);
      setUploadProgress(0);
      const form = new FormData();
      form.append("user", user);
      form.append("agreed", agreed ? 1 : 0);
      fanArt.forEach((file) => form.append("images", file));
      vitiligoDance.forEach((file) => form.append("videos", file));
      if (vitiligoFace[0]) form.append("vitiligoFace", vitiligoFace[0]);
      // Use axios directly to track progress
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      };
      // Use axios instance from useAxiospublic()
      const res = await axiospublic.post("/api/fan-art", form, config);
      return res.data;
    },
    onSuccess: () => {
      setUploading(false);
      setUploadProgress(0);
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Awaiting admin approval.",
        confirmButtonColor: "#6366f1",
        timer: 5000,
      });
      setMessage(null);
      setUser("");
      setFanArt([]);
      setVitiligoDance([]);
      setVitiligoFace([]);
      setAgreed(false);
      navigate("/fanart");
    },
    onError: (err) => {
      setUploading(false);
      setUploadProgress(0);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err?.response?.data?.error || "Upload failed.",
        confirmButtonColor: "#ef4444",
        timer: 4000,
      });
      setMessage(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Missing Field",
        text: "Your name is required.",
        confirmButtonColor: "#f59e42",
        timer: 4000,
      });
      return;
    }

    if (fanArt.length === 0 && vitiligoDance.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Media",
        text: "Please add at least a fan art image or vitiligo dance video.",
        confirmButtonColor: "#f59e42",
      });
      return;
    }

    if (!agreed) {
      Swal.fire({
        icon: "warning",
        title: "Permission Required",
        text: "You must accept the terms to grant permission for public posting.",
        confirmButtonColor: "#f59e42",
        timer: 4000,
      });
      return;
    }

    uploadFanArt({ user, fanArt, vitiligoDance, vitiligoFace, agreed });
  };

  return (
    <div className="bg-white p-2 lg:p-3">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 rounded-3xl shadow-2xl lg:my-2 bg-white">
        <p className="text-base text-gray-500 mb-6 text-center">
          Share your best creations! Upload your fan art, vitiligo dance, or
          vitiligo face photo. Our team will review your submission before it
          appears in the gallery.
        </p>
        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              <FiUser className="text-indigo-500" /> Your Name{" "}
              <span className="text-pink-600">*</span>
            </label>
            <input
              type="text"
              className="block w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 text-gray-800 bg-gray-50"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          {/* Fan Art (Images) */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              <FiImage className="text-indigo-500" /> Fan Art
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {fanArt.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow"
                    onClick={() => removeFanArt(i)}
                    tabIndex={-1}
                    title="Remove"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-xl text-gray-400 cursor-pointer hover:border-indigo-400 transition">
                <FiImage size={28} />
                <span className="text-xs font-medium">Add</span>
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  className="hidden"
                  onChange={handleFanArt}
                />
              </label>
            </div>
          </div>
          {/* Vitiligo Dance (Videos) */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              <FiVideo className="text-pink-500" /> Vitiligo Dance
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {vitiligoDance.map((vid, i) => (
                <div key={i} className="relative group">
                  <video
                    src={URL.createObjectURL(vid)}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                    controls
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow"
                    onClick={() => removeDance(i)}
                    tabIndex={-1}
                    title="Remove"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-xl text-gray-400 cursor-pointer hover:border-pink-400 transition">
                <FiVideo size={28} />
                <span className="text-xs font-medium">Add</span>
                <input
                  multiple
                  accept="video/*"
                  type="file"
                  className="hidden"
                  onChange={handleDance}
                />
              </label>
            </div>
          </div>
          {/* Vitiligo Face (Image) */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              <FiSmile className="text-yellow-400" /> Vitiligo Face
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {vitiligoFace[0] && (
                <div className="relative group">
                  <img
                    src={URL.createObjectURL(vitiligoFace[0])}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow"
                    onClick={removeFace}
                    tabIndex={-1}
                    title="Remove"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}
              {!vitiligoFace[0] && (
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-xl text-gray-400 cursor-pointer hover:border-yellow-400 transition">
                  <FiSmile size={28} />
                  <span className="text-xs font-medium">Add</span>
                  <input
                    accept="image/*"
                    type="file"
                    className="hidden"
                    onChange={handleFace}
                  />
                </label>
              )}
            </div>
          </div>
          {/* Permission Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              className="mt-1 cursor-pointer"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label
              htmlFor="agree"
              className="text-sm cursor-pointer text-gray-700 select-none"
            >
              Do you agree to grant permission for this content to be uploaded
              and made publicly available online for everyone to view?
            </label>
          </div>
          {/* Upload Progress Bar */}
          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 h-4 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-sm text-gray-700 mt-2 text-center font-semibold">
                Uploading {uploadProgress}%{" "}
                {uploadProgress < 100 ? "..." : "Processing..."}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2.5 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 transition"
            disabled={isPending || uploading}
          >
            {isPending || uploading ? (
              <FiUpload className="animate-bounce" />
            ) : (
              <FiPlus />
            )}
            {isPending || uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFanArt;
