import { useRef, useState, useEffect } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_OPEN_APIURL;

export default function IGComicsForm({ initial = null, onClose, onSave }) {
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef();

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
      setGalleryMedia((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, markedForRemoval: true } : item
        )
      );
    } else {
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (galleryMedia.filter((m) => !m.markedForRemoval).length === 0) {
      return Swal.fire(
        "No Files",
        "Please upload at least one media.",
        "error"
      );
    }
    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    galleryMedia.forEach((media) => {
      if (media.file && !media.markedForRemoval) {
        formData.append("mediaFiles", media.file);
      }
    });
    const existingFiles = galleryMedia
      .filter((media) => media.isExisting && !media.markedForRemoval)
      .map((media) => media.src);
    formData.append("existingFiles", JSON.stringify(existingFiles));

    const method = initial?.id ? "PUT" : "POST";
    const url = initial?.id
      ? `${API}/api/admin/ig-comics/${initial.id}`
      : `${API}/api/admin/ig-comics`;

    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      setUploadProgress(100);
      if (xhr.status >= 200 && xhr.status < 300) {
        Swal.fire({
          title: "Success!",
          text: "Comic saved successfully.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        });
        onSave && onSave();
        onClose && onClose();
      } else {
        let msg = "Failed to save comic.";
        try {
          msg = JSON.parse(xhr.response)?.error || msg;
        } catch {
          // ignore JSON error
        }
        Swal.fire("Error!", msg, "error");
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      Swal.fire("Error!", "Failed to upload comic.", "error");
    };

    xhr.send(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={isUploading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl relative overflow-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute cursor-pointer top-4 right-4 text-gray-300 hover:text-white"
          onClick={onClose}
          disabled={isUploading}
          aria-label="Close form"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <PhotoIcon className="w-6 h-6 text-pink-400" />
          {initial?.id ? "Edit Comic" : "Add Comic"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-1">Images / Videos</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="px-3 py-2 cursor-pointer"
              onChange={handleMediaInput}
              ref={fileInputRef}
              disabled={isUploading}
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
                    disabled={isUploading}
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

          {isUploading && (
            <div className="w-full mb-2">
              <div className="h-3 bg-gray-700 rounded">
                <div
                  className="h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
              <div className="text-center text-xs text-white mt-1">
                {uploadProgress}%
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-3"
          >
            {isUploading ? (
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
