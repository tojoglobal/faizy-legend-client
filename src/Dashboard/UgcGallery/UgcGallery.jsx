import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/ugc`;

const getYoutubeId = (input) => {
  if (!input) return "";
  const match = input.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/
  );
  if (match) return match[1];
  if (input.length === 11) return input;
  return input;
};

const getThumbnail = (youtube_id) =>
  `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;

export default function UgcGallery() {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [addRow, setAddRow] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    ugs: "",
  });

  const queryClient = useQueryClient();

  // Fetch all UGC videos
  const {
    data: videos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ugc-videos"],
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
          url: payload.url,
          ugs: payload.ugs,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      Swal.fire("Added!", "UGC video added successfully.", "success");
      setAddRow(false);
      setNewVideo({ title: "", url: "", ugs: "" });
      queryClient.invalidateQueries(["ugc-videos"]);
    },
    onError: (err) => {
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
          url: payload.url,
          ugs: payload.ugs,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      ),
    onSuccess: () => {
      Swal.fire("Updated!", "UGC video updated successfully.", "success");
      setEditingId(null);
      setEditingData({});
      queryClient.invalidateQueries(["ugc-videos"]);
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
      Swal.fire("Deleted!", "UGC video deleted.", "success");
      queryClient.invalidateQueries(["ugc-videos"]);
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
      url: video.url,
      ugs: video.ugs || "",
    });
  };
  const onCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };
  const onSaveEdit = async () => {
    if (!editingData.title || !editingData.url) {
      Swal.fire("Missing fields", "Title and Video URL are required.", "error");
      return;
    }
    updateMutation.mutate({
      id: editingId,
      payload: {
        title: editingData.title,
        url: editingData.url,
        ugs: editingData.ugs,
      },
    });
  };

  const onDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this UGC video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const onSaveNew = async () => {
    if (!newVideo.title || !newVideo.url) {
      Swal.fire("Missing fields", "Title and Video URL are required.", "error");
      return;
    }
    addMutation.mutate({
      title: newVideo.title,
      url: newVideo.url,
      ugs: newVideo.ugs,
    });
  };

  const onCancelNew = () => {
    setAddRow(false);
    setNewVideo({ title: "", url: "", ugs: "" });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-extrabold mb-3 text-white text-center">
        Manage UGC Gallery
      </h1>
      <div className="flex justify-end mb-4">
        <button
          className={`flex cursor-pointer items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-sm font-semibold shadow transition-all duration-200 ${
            addRow ? "opacity-60 pointer-events-none" : ""
          }`}
          onClick={() => setAddRow(true)}
          disabled={addRow}
        >
          <FaPlus /> Add New UGC Video
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md bg-gray-800">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-900 text-white border border-gray-600">
              <th className="px-2 py-2 rounded-tl-lg">Thumbnail</th>
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">Video URL</th>
              {/* <th className="px-2 py-2">UGS</th> */}
              <th className="px-2 py-2 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add new row */}
            {addRow && (
              <tr className="border-b border-gray-700 bg-gray-900">
                <td className="px-2 py-2 text-center align-middle">
                  {getYoutubeId(newVideo.url) && (
                    <img
                      src={getThumbnail(getYoutubeId(newVideo.url))}
                      alt="preview"
                      className="w-24 h-16 object-cover rounded shadow"
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
                    value={newVideo.url}
                    placeholder="YouTube URL"
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    required
                  />
                </td>
                {/* <td className="px-2 py-2 align-middle">
                  <input
                    className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-green-400"
                    value={newVideo.ugs}
                    placeholder="UGS"
                    onChange={(e) =>
                      setNewVideo((prev) => ({
                        ...prev,
                        ugs: e.target.value,
                      }))
                    }
                  />
                </td> */}
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
                        src={getThumbnail(getYoutubeId(editingData.url))}
                        alt="preview"
                        className="w-24 h-16 object-cover rounded shadow"
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
                        value={editingData.url}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                    </td>
                    {/* <td className="px-2 py-2 align-middle">
                      <input
                        className="w-full p-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
                        value={editingData.ugs}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            ugs: e.target.value,
                          }))
                        }
                      />
                    </td> */}
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
                        src={getThumbnail(getYoutubeId(video.url))}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded shadow"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-2 py-2 align-middle">{video.title}</td>
                    <td className="px-2 py-2 align-middle">
                      <a
                        href={video.url}
                        className="text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {video.url}
                      </a>
                    </td>
                    {/* <td className="px-2 py-2 align-middle">
                      {video.ugs || "-"}
                    </td> */}
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
