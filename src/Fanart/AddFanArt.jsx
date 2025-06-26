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

const AddFanArt = () => {
  const axiospublic = useAxiospublic();
  const [user, setUser] = useState("");
  const [fanArt, setFanArt] = useState([]); // images
  const [vitiligoDance, setVitiligoDance] = useState([]); // videos
  const [vitiligoFace, setVitiligoFace] = useState([]); // 1 image
  const [message, setMessage] = useState(null);
  const [agreed, setAgreed] = useState(false);

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

  // Mutation for upload with react-query
  const { mutate: uploadFanArt, isPending } = useMutation({
    mutationFn: async ({ user, fanArt, vitiligoDance, vitiligoFace }) => {
      const form = new FormData();
      form.append("user", user);
      // Add images (fan art)
      fanArt.forEach((file) => form.append("images", file));
      // Add videos (vitiligo dance)
      vitiligoDance.forEach((file) => form.append("videos", file));
      // Add vitiligo face image
      if (vitiligoFace[0]) form.append("vitiligoFace", vitiligoFace[0]);
      const res = await axiospublic.post("/api/fan-art", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Awaiting admin approval.",
        confirmButtonColor: "#6366f1",
      });
      setMessage(null);
      setUser("");
      setFanArt([]);
      setVitiligoDance([]);
      setVitiligoFace([]);
      setAgreed(false);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err?.response?.data?.error || "Upload failed.",
        confirmButtonColor: "#ef4444",
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
        text: "You must agree to the permission statement before submitting.",
        confirmButtonColor: "#f59e42",
      });
      return;
    }
    uploadFanArt({ user, fanArt, vitiligoDance, vitiligoFace });
  };

  return (
    <div className="bg-white p-3">
      <div className="max-w-2xl mx-auto p-4 lg:p-6 rounded-3xl shadow-2xl my-10 bg-white">
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
              required
            />
            <label
              htmlFor="agree"
              className="text-sm text-gray-700 select-none"
            >
              Do you agree to grant permission for this content to be uploaded
              and made publicly available online for everyone to view?
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 transition"
            disabled={isPending}
          >
            {isPending ? <FiUpload className="animate-bounce" /> : <FiPlus />}
            {isPending ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFanArt;
