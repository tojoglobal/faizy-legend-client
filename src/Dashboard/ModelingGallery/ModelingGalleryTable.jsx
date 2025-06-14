/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import GalleryForm from "./GalleryForm";
import Swal from "sweetalert2";

// const API = "/api/modeling-gallery";

export default function ModelingGalleryTable() {
  const API = import.meta.env.VITE_OPEN_APIURL + "/api/modeling-gallery";
  const [galleries, setGalleries] = useState([]);
  const [editGallery, setEditGallery] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setGalleries);
  }, []);

  const deleteGallery = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (res.ok) {
          setGalleries(galleries.filter((g) => g.id !== id));

          Swal.fire("Deleted!", "The gallery has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete the gallery.", "error");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.message || "An unexpected error occurred.",
          "error"
        );
      }
    }
  };

  const afterSave = () => {
    setEditGallery(null);
    fetch(API)
      .then((r) => r.json())
      .then(setGalleries);
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Modeling Galleries</h2>
        <button
          onClick={() => setEditGallery({})}
          className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded"
        >
          + Create Gallery
        </button>
      </div>
      {editGallery && (
        <GalleryForm
          initial={editGallery}
          onClose={() => setEditGallery(null)}
          afterSave={afterSave}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2">Thumbnail</th>
              <th className="p-2">Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">Photographer</th>
              <th className="p-2">Total Images</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {galleries.map((g) => (
              <tr
                key={g.id}
                className="border-b border-gray-700 hover:bg-gray-900"
              >
                <td className="p-2">
                  {g.thumbnail && (
                    <img
                      src={`${
                        import.meta.env.VITE_OPEN_APIURL
                      }/${g.thumbnail.replace("\\", "/")}`}
                      alt={g.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.location}</td>
                <td className="p-2">{g.photographer}</td>
                <td className="p-2">{g.images?.length}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setEditGallery(g)}
                    className="p-1 cursor-pointer rounded hover:bg-gray-800"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => deleteGallery(g.id)}
                    className="p-1 cursor-pointer rounded hover:bg-gray-800"
                  >
                    <TrashIcon className="w-5 h-5 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
            {galleries.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No galleries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
