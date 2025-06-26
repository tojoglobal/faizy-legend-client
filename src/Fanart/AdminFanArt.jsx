import { TrashIcon, CheckCircle2, XCircle, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useMutation } from "@tanstack/react-query";
import useDataQuery from "../utils/useDataQuery";
import { useState, useEffect } from "react";
import FanArtDetailsModal from "./FanArtDetailsModal";

const PAGE_SIZES = [5, 10, 15, 20];

export default function AdminFanArt() {
  const axiospublic = useAxiospublic();
  const API = "/api/fan-art";
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  const { data, isLoading, error, refetch } = useDataQuery(
    ["fanArtAdmin", page, perPage],
    `/api/fan-art/admin?page=${page}&limit=${perPage}`
  );

  // Parse images/tags (since stored as JSON/text in DB)
  const arts = Array.isArray(data?.rows)
    ? data.rows.map((a) => ({
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

  // Mutations (same as before)
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

  // Pagination logic
  const total = data?.total || 0;
  const lastPage = data?.lastPage || 1;

  // Handle if page is out of range after deletion etc
  useEffect(() => {
    if (page > lastPage) setPage(lastPage);
  }, [lastPage, page]);

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Fan Art Approvals</h2>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-sm">Show:</span>
          <select
            className="border rounded px-2 py-1 text-sm bg-gray-900 focus:outline-none cursor-pointer"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error loading fan art.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-2 text-left w-32">Thumbnail</th>
                  <th className="p-2 text-left w-40">Fan Name</th>
                  <th className="p-2 text-left w-28">Date</th>
                  <th className="p-2 text-left w-32">Status</th>
                  <th className="p-2 text-center w-44">Actions</th>
                </tr>
              </thead>
              <tbody>
                {arts.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-700 hover:bg-gray-900"
                  >
                    <td className="p-2 align-middle">
                      {a.images?.[0] ? (
                        <img
                          src={
                            a.images[0].startsWith("http")
                              ? a.images[0]
                              : `${import.meta.env.VITE_OPEN_APIURL}${
                                  a.images[0]
                                }`
                          }
                          alt={a.user}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : a.videos?.[0] ? (
                        <video
                          src={
                            a.videos[0].startsWith("http")
                              ? a.videos[0]
                              : `${import.meta.env.VITE_OPEN_APIURL}${
                                  a.videos[0]
                                }`
                          }
                          className="w-16 h-16 object-cover rounded"
                          muted
                          controls={false}
                        />
                      ) : a.vitiligoFace?.[0] ? (
                        <img
                          src={
                            a.vitiligoFace[0].startsWith("http")
                              ? a.vitiligoFace[0]
                              : `${import.meta.env.VITE_OPEN_APIURL}${
                                  a.vitiligoFace[0]
                                }`
                          }
                          alt={a.user}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : null}
                    </td>
                    <td className="p-2 align-middle">{a.user}</td>
                    <td className="p-2 align-middle">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="p-2 align-middle">
                      {a.approved === 1 ? (
                        <span className="inline-flex items-center text-green-600 font-semibold gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Approved
                        </span>
                      ) : a.approved === 0 ? (
                        <span className="inline-flex items-center text-red-500 font-semibold gap-1">
                          <XCircle className="w-4 h-4" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-500 font-semibold gap-1">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-2 align-middle text-center">
                      <div className="inline-flex items-center justify-center gap-2">
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
                      </div>
                    </td>
                  </tr>
                ))}
                {arts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No fan art submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 select-none">
              <button
                className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                &laquo; First
              </button>
              <button
                className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              {/* Show up to 5 pages: previous, current, next, ... */}
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 ||
                    n === lastPage ||
                    (n >= page - 1 && n <= page + 1)
                )
                .map((n, idx, arr) =>
                  idx > 0 && n - arr[idx - 1] > 1 ? (
                    <span key={n + "-dots"} className="px-1 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={n}
                      className={`px-3 py-1 rounded ${
                        n === page
                          ? "bg-indigo-600 text-white shadow font-bold"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setPage(n)}
                      disabled={n === page}
                    >
                      {n}
                    </button>
                  )
                )}
              <button
                className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
              >
                Next
              </button>
              <button
                className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage(lastPage)}
                disabled={page === lastPage}
              >
                Last &raquo;
              </button>
              <span className="ml-2 text-gray-500 text-sm">
                Page {page} of {lastPage} ({total} total)
              </span>
            </div>
          )}
        </>
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
