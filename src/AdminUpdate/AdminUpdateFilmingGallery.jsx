import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

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

export default function AdminUpdateFilmingGallery() {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [addRow, setAddRow] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    youtube_id: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch all videos
  const {
    data: videos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["filming-videos"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: async (payload) =>
      axios.post(
        API_URL,
        {
          title: payload.title,
          youtube_id: getYoutubeId(payload.youtube_id),
          description: payload.description || "",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      Swal.fire("Added!", "Video added successfully.", "success");
      setAddRow(false);
      setNewVideo({ title: "", youtube_id: "", description: "" });
      queryClient.invalidateQueries(["filming-videos"]);
    },
    onError: (err) => {
      console.log("Add error:", err?.response?.data || err.message, err);
      Swal.fire(
        "Error",
        err?.response?.data?.error || err.message || "Could not add video.",
        "error"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) =>
      axios.put(
        `${API_URL}/${id}`,
        {
          title: payload.title,
          youtube_id: getYoutubeId(payload.youtube_id),
          description: payload.description || "",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      Swal.fire("Updated!", "Video updated successfully.", "success");
      setEditingId(null);
      setEditingData({});
      queryClient.invalidateQueries(["filming-videos"]);
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err?.response?.data?.error || err.message || "Could not update video.",
        "error"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(`${API_URL}/${id}`, { withCredentials: true }),
    onSuccess: () => {
      Swal.fire("Deleted!", "Video deleted.", "success");
      queryClient.invalidateQueries(["filming-videos"]);
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err?.response?.data?.error || err.message || "Could not delete video.",
        "error"
      );
    },
  });

  // Actions
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
    updateMutation.mutate({
      id: editingId,
      payload: {
        title: editingData.title,
        youtube_id: editingData.youtube_id,
        description: editingData.description,
      },
    });
  };

  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const onSaveNew = async () => {
    if (!newVideo.title || !newVideo.youtube_id) {
      Swal.fire(
        "Missing fields",
        "Title and YouTube ID are required.",
        "error"
      );
      return;
    }
    addMutation.mutate({
      title: newVideo.title,
      youtube_id: newVideo.youtube_id,
      description: newVideo.description,
    });
  };

  const onCancelNew = () => {
    setAddRow(false);
    setNewVideo({ title: "", youtube_id: "", description: "" });
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Filming Gallery</h1>
        <button
          className={`bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded font-medium transition ${
            addRow ? "opacity-60 pointer-events-none" : ""
          }`}
          onClick={() => setAddRow(true)}
          disabled={addRow}
        >
          + Add New Video
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md bg-gray-800">
        <table className="min-w-full text-white border border-gray-600">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-2 py-2 rounded-tl-lg">Thumbnail</th>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">YouTube Link</th>
              <th className="px-2 py-2">Description</th>
              <th className="px-2 py-2 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new row */}
            {addRow && (
              <tr className="border-b border-gray-700 bg-gray-900">
                <td className="px-2 py-2 text-center align-middle">
                  {getYoutubeId(newVideo.youtube_id) && (
                    <img
                      src={getThumbnail(getYoutubeId(newVideo.youtube_id))}
                      alt="preview"
                      className="w-24 h-12 object-cover rounded shadow"
                    />
                  )}
                </td>
                <td className="px-2 py-2 align-middle">
                  <input
                    className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-400"
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
                <td className="px-2 py-2 align-middle">
                  <input
                    className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-400"
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
                <td className="px-2 py-2 align-middle">
                  <textarea
                    className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-400"
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
                <td className="px-2 py-2 align-middle flex gap-2 justify-center">
                  <button
                    className="bg-green-600 cursor-pointer px-3 py-1 text-white rounded shadow flex items-center gap-1 hover:bg-green-700"
                    onClick={onSaveNew}
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <FaSave />
                    )}
                    Add
                  </button>
                  <button
                    className="bg-gray-700 cursor-pointer px-3 py-1 text-white rounded shadow flex items-center gap-1 hover:bg-gray-600"
                    onClick={onCancelNew}
                  >
                    <FaTimes /> Cancel
                  </button>
                </td>
              </tr>
            )}
            {/* List all videos */}
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-red-400">
                  Error: {error?.message || "Failed to fetch videos"}
                </td>
              </tr>
            ) : (
              videos.map((video, idx) =>
                editingId === video.id ? (
                  <tr
                    className="border-b border-gray-700 bg-gray-900"
                    key={video.id}
                  >
                    <td className="px-2 py-2 text-center align-middle">
                      <img
                        src={getThumbnail(getYoutubeId(editingData.youtube_id))}
                        alt="preview"
                        className="w-24 h-12 object-cover rounded shadow"
                      />
                    </td>
                    <td className="px-2 py-2 align-middle">
                      <input
                        className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
                        value={editingData.title}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="px-2 py-2 align-middle">
                      <input
                        className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
                        value={editingData.youtube_id}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            youtube_id: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="px-2 py-2 align-middle">
                      <textarea
                        className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
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
                    <td className="px-2 py-2 align-middle flex gap-2 justify-center">
                      <button
                        className="bg-green-600 cursor-pointer px-3 py-1 text-white rounded shadow flex items-center gap-1 hover:bg-green-700"
                        onClick={onSaveEdit}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <FaSave />
                        )}
                        Save
                      </button>
                      <button
                        className="bg-gray-700 cursor-pointer px-3 py-1 text-white rounded shadow flex items-center gap-1 hover:bg-gray-600"
                        onClick={onCancelEdit}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={video.id}
                    className={`hover:bg-gray-700 transition ${
                      idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    <td className="px-2 py-2 text-center align-middle">
                      <img
                        src={getThumbnail(getYoutubeId(video.youtube_id))}
                        alt={video.title}
                        className="w-24 h-12 object-cover rounded shadow"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-2 py-2 align-middle">{video.title}</td>
                    <td className="px-2 py-2 align-middle">
                      <a
                        href={`https://youtu.be/${getYoutubeId(
                          video.youtube_id
                        )}`}
                        className="text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {video.youtube_id}
                      </a>
                    </td>
                    <td className="px-2 py-2 align-middle">
                      {video.description || "-"}
                    </td>
                    <td className="px-2 py-2 align-middle flex gap-2 justify-center">
                      <button
                        className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 px-3 py-1 rounded shadow"
                        onClick={() => onEdit(video)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-700 cursor-pointer hover:bg-red-800 px-3 py-1 rounded shadow"
                        onClick={() => onDelete(video.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
