/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import IGComicsForm from "./IGComicsForm";

export default function AdminIGComicsTable() {
  const API = import.meta.env.VITE_OPEN_APIURL + "/api/admin/ig-comics";
  const [comics, setComics] = useState([]);
  const [editComic, setEditComic] = useState(null);

  const fetchComics = () => {
    fetch(API)
      .then((r) => r.json())
      .then(setComics)
      .catch((err) => console.error("Error loading comics:", err));
  };

  useEffect(() => {
    fetchComics();
  }, []);

  const deleteComic = async (id) => {
    console.log("Attempting to delete comic id:", id, `URL: ${API}/${id}`);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      console.log("Delete response status:", res.status);

      if (res.ok) {
        setComics((prevComics) => prevComics.filter((c) => c.id !== id));
        Swal.fire("Deleted!", "Comic has been deleted.", "success");
      } else {
        const errorData = await res.json().catch(() => ({}));
        Swal.fire(
          "Error!",
          errorData.error || "Failed to delete comic.",
          "error"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire(
        "Error!",
        error.message || "An unexpected error occurred.",
        "error"
      );
    }
  };

  const afterSave = () => {
    setEditComic(null);
    fetchComics();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Instagram Comics</h2>
        <button
          onClick={() => setEditComic({})}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded"
        >
          + Add Comic
        </button>
      </div>
      {editComic && (
        <IGComicsForm
          initial={editComic}
          onClose={() => setEditComic(null)}
          afterSave={afterSave}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2">Thumbnail</th>
              <th className="p-2">Total Images</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comics.map((comic) => (
              <tr
                key={comic.id}
                className="border-b border-gray-700 hover:bg-gray-900"
              >
                <td className="p-2">
                  {comic.thumbnail && (
                    <img
                      src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                        comic.thumbnail
                      }`}
                      alt="thumbnail"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2">
                  {JSON.parse(comic.images || "[]").length}
                </td>
                <td className="p-2">
                  {new Date(comic.created_at).toLocaleString()}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setEditComic(comic)}
                    className="p-1 rounded hover:bg-gray-800"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => deleteComic(comic.id)}
                    className="p-1 rounded hover:bg-gray-800"
                  >
                    <TrashIcon className="w-5 h-5 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
            {comics.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No comics found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
