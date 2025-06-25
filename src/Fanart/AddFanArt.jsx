import { useState } from "react";
import { FiPlus, FiUpload, FiX, FiImage, FiVideo } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const MAX_IMAGES = 10;
const MAX_VIDEOS = 2;

const AddFanArt = () => {
  const axiospublic = useAxiospublic();
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState(null);

  // Image/video handlers
  const handleImages = (e) => {
    let files = Array.from(e.target.files).slice(0, MAX_IMAGES - images.length);
    setImages([...images, ...files]);
  };
  const handleVideos = (e) => {
    let files = Array.from(e.target.files).slice(0, MAX_VIDEOS - videos.length);
    setVideos([...videos, ...files]);
  };
  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));
  const removeVideo = (idx) => setVideos(videos.filter((_, i) => i !== idx));

  // Mutation for upload with react-query
  const { mutate: uploadFanArt, isPending } = useMutation({
    mutationFn: async ({ title, user, tags, images, videos }) => {
      const form = new FormData();
      form.append("title", title);
      form.append("user", user);
      form.append("tags", tags);
      images.forEach((file) => form.append("images", file));
      videos.forEach((file) => form.append("videos", file));
      // Use your API base url or useAxiospublic if you have custom instance
      const res = await axiospublic.post("/api/fan-art", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage({
        type: "success",
        text: "Submitted! Awaiting admin approval.",
      });
      setTitle("");
      setUser("");
      setTags("");
      setImages([]);
      setVideos([]);
    },
    onError: (err) => {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "Upload failed.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (!title || !user) {
      setMessage({ type: "error", text: "Title and your name are required." });
      return;
    }
    if (images.length === 0 && videos.length === 0) {
      setMessage({
        type: "error",
        text: "Please add at least 1 image or video.",
      });
      return;
    }
    uploadFanArt({ title, user, tags, images, videos });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl my-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-5 text-center">
        Add Your Fan Art
      </h2>
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
        <div>
          <label className="font-semibold text-gray-700">Title *</label>
          <input
            type="text"
            className="block w-full mt-1 px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300 text-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fan art title"
            required
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Your Name *</label>
          <input
            type="text"
            className="block w-full mt-1 px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300 text-gray-800"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700">
            Tags{" "}
            <span className="text-gray-500 font-normal">(comma separated)</span>
          </label>
          <input
            type="text"
            className="block w-full mt-1 px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300 text-gray-800"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="eg. nature, character, digital"
          />
        </div>
        {/* Image upload */}
        <div>
          <label className="font-semibold text-gray-700">
            Images (max {MAX_IMAGES})
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow"
                  onClick={() => removeImage(i)}
                  tabIndex={-1}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg text-gray-400 cursor-pointer hover:border-indigo-400">
                <FiImage size={28} />
                <span className="text-xs">Add</span>
                <input
                  multiple
                  accept="image/*"
                  type="file"
                  className="hidden"
                  onChange={handleImages}
                  disabled={images.length >= MAX_IMAGES}
                />
              </label>
            )}
          </div>
        </div>
        {/* Video upload */}
        <div>
          <label className="font-semibold text-gray-700">
            Videos (max {MAX_VIDEOS})
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {videos.map((vid, i) => (
              <div key={i} className="relative group">
                <video
                  src={URL.createObjectURL(vid)}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow"
                  onClick={() => removeVideo(i)}
                  tabIndex={-1}
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
            {videos.length < MAX_VIDEOS && (
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg text-gray-400 cursor-pointer hover:border-indigo-400">
                <FiVideo size={28} />
                <span className="text-xs">Add</span>
                <input
                  multiple
                  accept="video/*"
                  type="file"
                  className="hidden"
                  onChange={handleVideos}
                  disabled={videos.length >= MAX_VIDEOS}
                />
              </label>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? <FiUpload className="animate-bounce" /> : <FiPlus />}
          {isPending ? "Uploading..." : "Submit Fan Art"}
        </button>
      </form>
      <p className="text-xs text-gray-500 text-center mt-6">
        Your submission will be reviewed by admin before it appears in the
        gallery.
      </p>
    </div>
  );
};

export default AddFanArt;
