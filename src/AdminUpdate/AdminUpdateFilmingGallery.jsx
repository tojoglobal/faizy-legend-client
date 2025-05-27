import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/filming`;

const getYoutubeId = (input) => {
  if (!input) return "";
  const match = input.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  );
  if (match) return match[1];
  if (input.length === 11) return input;
  return input;
};

const getThumbnail = (youtube_id) =>
  `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;

const AdminUpdateFilmingGallery = () => {
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [addRow, setAddRow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    youtube_id: "",
    description: "",
  });

  const fetchVideos = async () => {
    const res = await axios.get(API_URL);
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Edit
  const onEdit = (video) => {
    setEditingId(video.id);
    setEditingData({
      title: video.title,
      youtube_id: video.youtube_id,
      description: video.description || "",
    });
  };
  const onCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };
  const onSaveEdit = async () => {
    if (!editingData.title || !editingData.youtube_id) {
      Swal.fire(
        "Missing fields",
        "Title and YouTube ID are required.",
        "error"
      );
      return;
    }
    setIsSaving(true);
    try {
      await axios.put(
        `${API_URL}/${editingId}`,
        {
          title: editingData.title,
          youtube_id: getYoutubeId(editingData.youtube_id),
          description: editingData.description,
        },
        { withCredentials: true }
      );
      Swal.fire("Updated!", "Video updated successfully.", "success");
      setEditingId(null);
      setEditingData({});
      fetchVideos();
    } catch (error) {
      Swal.fire("Error", error.message || "Could not update video.", "error");
    }
    setIsSaving(false);
  };

  // Delete
  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      setVideos((prev) => prev.filter((v) => v.id !== id));
      Swal.fire("Deleted!", "Video deleted.", "success");
    }
  };

  // Add new video
  const onSaveNew = async () => {
    if (!newVideo.title || !newVideo.youtube_id) {
      Swal.fire(
        "Missing fields",
        "Title and YouTube ID are required.",
        "error"
      );
      return;
    }
    setIsSaving(true);
    try {
      await axios.post(
        API_URL,
        {
          title: newVideo.title,
          youtube_id: getYoutubeId(newVideo.youtube_id),
          description: newVideo.description,
        },
        { withCredentials: true }
      );
      Swal.fire("Added!", "Video added successfully.", "success");
      setAddRow(false);
      setNewVideo({ title: "", youtube_id: "", description: "" });
      fetchVideos();
    } catch (error) {
      Swal.fire("Error", error.message || "Could not add video.", "error");
    }
    setIsSaving(false);
  };
  const onCancelNew = () => {
    setAddRow(false);
    setNewVideo({ title: "", youtube_id: "", description: "" });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Filming Gallery</h1>
      <button
        className="mb-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-semibold"
        onClick={() => setAddRow(true)}
        disabled={addRow}
      >
        + Add New Video
      </button>
      <div className="overflow-x-auto rounded-lg shadow-md bg-gray-800">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-2 py-2">Thumbnail</th>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">YouTube ID/Link</th>
              <th className="px-2 py-2">Description</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new row */}
            {addRow && (
              <tr className="border-b border-gray-700 bg-gray-900">
                <td className="px-2 py-2 text-center">
                  {getYoutubeId(newVideo.youtube_id) && (
                    <img
                      src={getThumbnail(getYoutubeId(newVideo.youtube_id))}
                      alt="preview"
                      className="w-24 h-16 object-cover rounded mx-auto"
                    />
                  )}
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-full p-1 rounded bg-gray-800 text-white"
                    value={newVideo.title}
                    placeholder="Title"
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-full p-1 rounded bg-gray-800 text-white"
                    value={newVideo.youtube_id}
                    placeholder="YouTube ID or Link"
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        youtube_id: e.target.value,
                      }))
                    }
                    required
                  />
                </td>
                <td className="px-2 py-2">
                  <textarea
                    className="w-full p-1 rounded bg-gray-800 text-white"
                    rows={2}
                    value={newVideo.description}
                    placeholder="Description"
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    className="bg-green-600 cursor-pointer px-3 py-1 text-white rounded mr-2"
                    onClick={onSaveNew}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Add"}
                  </button>
                  <button
                    className="bg-gray-700 cursor-pointer px-3 py-1 text-white rounded"
                    onClick={onCancelNew}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {/* List all videos */}
            {videos.map((video) =>
              editingId === video.id ? (
                <tr
                  className="border-b border-gray-700 bg-gray-900"
                  key={video.id}
                >
                  <td className="px-2 py-2 text-center">
                    <img
                      src={getThumbnail(getYoutubeId(editingData.youtube_id))}
                      alt="preview"
                      className="w-24 h-16 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      className="w-full p-1 rounded bg-gray-800 text-white"
                      value={editingData.title}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      className="w-full p-1 rounded bg-gray-800 text-white"
                      value={editingData.youtube_id}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          youtube_id: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <textarea
                      className="w-full p-1 rounded bg-gray-800 text-white"
                      rows={2}
                      value={editingData.description}
                      onChange={(e) =>
                        setEditingData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      className="bg-green-600 cursor-pointer px-3 py-1 text-white rounded mr-2"
                      onClick={onSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-700 cursor-pointer px-3 py-1 text-white rounded"
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr
                  className="border-b border-gray-700 hover:bg-gray-800"
                  key={video.id}
                >
                  <td className="px-2 py-2 text-center">
                    <img
                      src={getThumbnail(getYoutubeId(video.youtube_id))}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded mx-auto"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-2 py-2">{video.title}</td>
                  <td className="px-2 py-2">{video.youtube_id}</td>
                  <td className="px-2 py-2">{video.description || "-"}</td>
                  <td className="px-2 py-2">
                    <button
                      className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-3 py-1 text-white rounded mr-2"
                      onClick={() => onEdit(video)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 cursor-pointer hover:bg-red-700 px-3 py-1 text-white rounded"
                      onClick={() => onDelete(video.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUpdateFilmingGallery;
