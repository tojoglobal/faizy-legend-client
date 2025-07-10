import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";
import IGComicsForm from "./IGComicsForm";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

export default function AdminIGComicsTable() {
  const axiosPublicUrl = useAxiospublic();
  const API = "/api/admin/ig-comics";
  const queryClient = useQueryClient();
  const [editComic, setEditComic] = useState(null);
  const [modalItem, setModalItem] = useState(null);

  // Fetch comics using TanStack Query
  const {
    data: comics = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ig-comics"],
    queryFn: async () => {
      const { data } = await axiosPublicUrl.get(API);
      return data;
    },
  });

  // Delete comic mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosPublicUrl.delete(`${API}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["ig-comics"]);
      Swal.fire("Deleted!", "Comic has been deleted.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to delete comic.",
        "error"
      );
    },
  });

  // Create/Update comic mutation
  const saveMutation = useMutation({
    mutationFn: ({ id, formData }) => {
      if (id) {
        // Update existing comic
        return axiosPublicUrl.put(`${API}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new comic
        return axiosPublicUrl.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ig-comics"]);
      setEditComic(null);
      Swal.fire("Success!", "Comic saved successfully.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to save comic.",
        "error"
      );
    },
  });

  const deleteComic = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  // Wrap handleSave to pass correct params
  const handleSave = ({ id, galleryMedia }) => {
    if (!galleryMedia || galleryMedia.length === 0) {
      Swal.fire("Error", "At least one image or video is required.", "error");
      return;
    }

    const formData = new FormData();

    // Add new files
    galleryMedia.forEach((media) => {
      if (media.file) {
        formData.append("mediaFiles", media.file);
      }
    });

    // Add existing files that haven't been removed
    const existingFiles = galleryMedia
      .filter((media) => media.isExisting && !media.markedForRemoval)
      .map((media) => media.src);

    formData.append("existingFiles", JSON.stringify(existingFiles));

    saveMutation.mutate({ id, formData });
  };

  // Safely parse images JSON
  const parseImages = (imagesStr) => {
    try {
      return JSON.parse(imagesStr || "[]");
    } catch {
      return [];
    }
  };

  // Detect if URL is video by extension
  const isVideo = (url) => url?.toLowerCase().endsWith(".mp4");

  if (isLoading) return <div className="p-4">Loading comics...</div>;
  if (isError) return <div className="p-4">Error loading comics</div>;

  return (
    <div className="p-1 lg:p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Instagram Comics</h2>
        <button
          onClick={() => setEditComic({})}
          className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded"
        >
          + Add Comic
        </button>
      </div>

      {/* Edit/Add Form */}
      {editComic !== null && (
        <IGComicsForm
          initial={
            editComic.id
              ? {
                  id: editComic.id,
                  images: parseImages(editComic.images),
                }
              : null
          }
          onClose={() => setEditComic(null)}
          onSave={handleSave}
          isSubmitting={saveMutation.isLoading}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-left text-white">
              <th className="p-2">Thumbnail</th>
              <th className="p-2">Total Images/Videos</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comics.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No comics found.
                </td>
              </tr>
            )}
            {comics.map((comic) => {
              const images = parseImages(comic.images);
              const firstMedia = images[0];
              return (
                <tr
                  key={comic.id}
                  className="border-b border-gray-700 hover:bg-gray-900"
                >
                  <td className="p-2">
                    {firstMedia && (
                      <>
                        {!isVideo(firstMedia) ? (
                          <img
                            src={`${
                              import.meta.env.VITE_OPEN_APIURL
                            }/uploads/${firstMedia}`}
                            alt="thumbnail"
                            className="w-20 h-16 object-cover rounded"
                          />
                        ) : (
                          <video
                            src={`${
                              import.meta.env.VITE_OPEN_APIURL
                            }/uploads/${firstMedia}`}
                            className="w-20 h-16 object-cover rounded"
                            muted
                            loop
                            playsInline
                          />
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-2">{images.length}</td>
                  <td className="p-2">
                    {new Date(comic.created_at).toLocaleString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    {/* Details button */}
                    <button
                      onClick={() => setModalItem({ images, id: comic.id })}
                      className="p-1 cursor-pointer rounded hover:bg-gray-800"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5 text-green-400" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditComic(comic)}
                      className="p-1 cursor-pointer rounded hover:bg-gray-800"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5 text-blue-400" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteComic(comic.id)}
                      className="p-1 cursor-pointer rounded hover:bg-gray-800"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing images/videos */}
      {modalItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-gray-400 rounded-3xl shadow-2xl overflow-auto max-w-4xl w-full max-h-[90vh] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-3 cursor-pointer right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {modalItem.images.map((media, idx) =>
                !isVideo(media) ? (
                  <img
                    key={idx}
                    src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${media}`}
                    alt={`comic media ${idx + 1}`}
                    className="rounded shadow max-h-96 w-full object-contain"
                  />
                ) : (
                  <ReactPlayer
                    key={idx}
                    url={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${media}`}
                    controls
                    width="100%"
                    height="240px"
                    className="rounded shadow"
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
