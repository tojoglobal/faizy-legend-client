import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API_URL = "http://localhost:5001/api/filming";

const AdminUpdateFilmingGallery = () => {
  const [videos, setVideos] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch all videos
  useEffect(() => {
    axios.get(API_URL).then((res) => setVideos(res.data));
  }, []);

  // Start editing a video
  const onEdit = (video) => {
    setEditing(video.id);
    setValue("title", video.title);
    setValue("image_url", video.image_url);
    setValue("youtube_id", video.youtube_id);
    setValue("description", video.description || "");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    reset();
  };

  // Save updated video
  const onSubmit = async (data) => {
    try {
      await axios.put(`${API_URL}/${editing}`, data, { withCredentials: true });
      Swal.fire("Updated!", "Video updated successfully.", "success");
      setEditing(null);
      // refresh list
      const res = await axios.get(API_URL);
      setVideos(res.data);
      reset();
    } catch (e) {
      console.log(e);
      Swal.fire("Error", "Could not update video.", "error");
    }
  };

  // Delete a video
  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setVideos(videos.filter((v) => v.id !== id));
      Swal.fire("Deleted!", "Video deleted.", "success");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Filming Gallery</h1>
      {videos?.map((video) => (
        <div
          key={video.id}
          className="border border-gray-700 rounded-lg p-4 mb-6 bg-gray-800"
        >
          {editing === video.id ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2">
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  {...register("title", { required: true })}
                  className="w-full p-2 rounded bg-gray-900 text-white"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-300 mb-1">Image URL</label>
                <input
                  {...register("image_url", { required: true })}
                  className="w-full p-2 rounded bg-gray-900 text-white"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-300 mb-1">YouTube ID</label>
                <input
                  {...register("youtube_id", { required: true })}
                  className="w-full p-2 rounded bg-gray-900 text-white"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 rounded bg-gray-900 text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={video.image_url}
                  alt={video.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div>
                  <div className="text-lg font-bold text-white">
                    {video.title}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {video.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    YouTube ID: {video.youtube_id}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEdit(video)}
                  className="bg-blue-600 px-3 py-1 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(video.id)}
                  className="bg-red-600 px-3 py-1 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUpdateFilmingGallery;
