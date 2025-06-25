import {
  TrashIcon,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";
import { useState } from "react";
import FanArtDetailsModal from "./FanArtDetailsModal";

export default function AdminFanArt() {
  const axiospublic = useAxiospublic();
  const API = "/api/fan-art";
  const [selected, setSelected] = useState(null);

  const {
    data: artsRaw,
    isLoading,
    error,
    refetch,
  } = useDataQuery(["fanArtAdmin"], API);

  // Parse images/tags (since stored as JSON/text in DB)
  const arts = Array.isArray(artsRaw)
    ? artsRaw.map((a) => ({
        ...a,
        images:
          typeof a.images === "string"
            ? JSON.parse(a.images || "[]")
            : a.images,
        videos:
          typeof a.videos === "string"
            ? JSON.parse(a.videos || "[]")
            : a.videos,
        tags:
          typeof a.tags === "string"
            ? a.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : a.tags || [],
      }))
    : [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiospublic.delete(`${API}/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "The fan art has been deleted.", "success");
      refetch();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err?.response?.data?.error || "Failed to delete the fan art.",
        "error"
      );
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => axiospublic.patch(`${API}/${id}/approve`),
    onSuccess: () => {
      Swal.fire("Approved!", "The fan art is now public.", "success");
      refetch();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err?.response?.data?.error || "Failed to approve the fan art.",
        "error"
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => axiospublic.patch(`${API}/${id}/reject`),
    onSuccess: () => {
      Swal.fire("Rejected!", "The fan art has been rejected.", "success");
      refetch();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err?.response?.data?.error || "Failed to reject the fan art.",
        "error"
      );
    },
  });

  // Action handlers
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: "Approve this fan art?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#22c55e",
    });
    if (result.isConfirmed) approveMutation.mutate(id);
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Reject this fan art?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#ef4444",
    });
    if (result.isConfirmed) rejectMutation.mutate(id);
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Fan Art Approvals</h2>
        <Link
          to="/add-fan-art"
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded font-medium transition"
        >
          <PlusCircle size={18} /> Add Fan Art
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error loading fan art.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2 text-left">Thumbnail</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Fan Name</th>
                <th className="p-2 text-left">Tags</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {arts.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-700 hover:bg-gray-900"
                >
                  <td className="p-2">
                    {a.images?.[0] && (
                      <img
                        src={
                          a.images[0].startsWith("http")
                            ? a.images[0]
                            : `${import.meta.env.VITE_OPEN_APIURL}${
                                a.images[0]
                              }`
                        }
                        alt={a.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2">{a.title}</td>
                  <td className="p-2">{a.user}</td>
                  <td className="p-2">
                    {a.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs mr-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="p-2">
                    {a.created_at
                      ? new Date(a.created_at).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">
                    {a.approved === true ? (
                      <span className="inline-flex items-center text-green-600 font-semibold gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Approved
                      </span>
                    ) : a.approved === false ? (
                      <span className="inline-flex items-center text-red-500 font-semibold gap-1">
                        <XCircle className="w-4 h-4" /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-yellow-500 font-semibold gap-1">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => setSelected(a)}
                      className="p-1 cursor-pointer rounded hover:bg-blue-100"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    {a.approved === null && (
                      <>
                        <button
                          onClick={() => handleApprove(a.id)}
                          className="p-1 cursor-pointer rounded hover:bg-green-100"
                          title="Approve"
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleReject(a.id)}
                          className="p-1 cursor-pointer rounded hover:bg-red-100"
                          title="Reject"
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="w-5 h-5 text-red-500" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1 cursor-pointer rounded hover:bg-gray-800"
                      title="Delete"
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {arts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No fan art submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <FanArtDetailsModal
        open={!!selected}
        art={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </div>
  );
}
