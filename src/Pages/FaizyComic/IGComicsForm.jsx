import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_OPEN_APIURL;
export default function IGComicsForm({
  initial = null,
  onClose,
  onSave,
  isSubmitting,
}) {
  const { handleSubmit } = useForm();
  const [galleryMedia, setGalleryMedia] = useState([]);
  const fileInputRef = useRef();

  // Load existing media on edit
  useEffect(() => {
    if (initial && initial.images?.length > 0) {
      const existingMedia = initial.images.map((filename) => ({
        src: filename,
        isExisting: true,
      }));
      setGalleryMedia(existingMedia);
    } else {
      setGalleryMedia([]);
    }
  }, [initial]);

  const handleAddMedia = (files) => {
    if (galleryMedia.length + files.length > 40) {
      Swal.fire("Limit Reached", "You can upload up to 40 files.", "warning");
      return;
    }

    const newMedia = files.map((file) => ({
      src: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setGalleryMedia((prev) => [...prev, ...newMedia]);
  };

  const handleMediaInput = (e) => {
    const files = Array.from(e.target.files);
    handleAddMedia(files);
    e.target.value = null;
  };

  const handleRemoveMedia = (index) => {
    const media = galleryMedia[index];
    if (media.isExisting) {
      // Mark existing files for removal instead of immediately removing
      setGalleryMedia((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, markedForRemoval: true } : item
        )
      );
    } else {
      // For new files, just remove them
      setGalleryMedia((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const undoRemoveMedia = (index) => {
    setGalleryMedia((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, markedForRemoval: false } : item
      )
    );
  };

  const onSubmit = () => {
    if (galleryMedia.length === 0) {
      return Swal.fire(
        "No Files",
        "Please upload at least one media.",
        "error"
      );
    }

    onSave({
      id: initial?.id,
      galleryMedia,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl relative overflow-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute cursor-pointer top-4 right-4 text-gray-300 hover:text-white"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close form"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <PhotoIcon className="w-6 h-6 text-pink-400" />
          {initial?.id ? "Edit Comic" : "Add Comic"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white mb-1">Images / Videos</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="border border-gray-600 rounded px-3 py-1 cursor-pointer"
              onChange={handleMediaInput}
              ref={fileInputRef}
              disabled={isSubmitting}
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {galleryMedia.map((media, idx) => (
                <div
                  key={idx}
                  className={`relative group shadow rounded border overflow-hidden ${
                    media.markedForRemoval ? "opacity-50 border-red-500" : ""
                  }`}
                >
                  {media.file ? (
                    media.file.type.startsWith("video") ? (
                      <video
                        src={media.src}
                        className="w-20 h-20 object-cover rounded"
                        controls
                      />
                    ) : (
                      <img
                        src={media.src}
                        alt=""
                        className="w-20 h-20 object-cover rounded"
                      />
                    )
                  ) : media.src.toLowerCase().endsWith(".mp4") ? (
                    <video
                      src={`${API}/uploads/${media.src}`}
                      className="w-20 h-20 object-cover rounded"
                      controls
                    />
                  ) : (
                    <img
                      src={`${API}/uploads/${media.src}`}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      media.markedForRemoval
                        ? undoRemoveMedia(idx)
                        : handleRemoveMedia(idx)
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={isSubmitting}
                    aria-label={
                      media.markedForRemoval ? "Undo remove" : "Remove media"
                    }
                  >
                    {media.markedForRemoval ? (
                      <span className="text-xs">Undo</span>
                    ) : (
                      <XMarkIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-3"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                {initial?.id ? "Saving..." : "Creating..."}
              </>
            ) : initial?.id ? (
              "Save Changes"
            ) : (
              "Create Comic"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
