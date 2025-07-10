import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { FaSpinner } from "react-icons/fa";

const API = import.meta.env.VITE_OPEN_APIURL;

export default function IGComicsForm({ initial = {}, onClose, afterSave }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({ defaultValues: initial });

  const [previewThumb, setPreviewThumb] = useState(
    initial.thumbnail ? `${API}/uploads/${initial.thumbnail}` : null
  );
  const [galleryImgs, setGalleryImgs] = useState(
    initial.images
      ? JSON.parse(initial.images).map((img) => ({
          src: `${API}/uploads/${img}`,
          file: null,
          isOld: true,
        }))
      : []
  );

  const fileInputRef = useRef();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    register("thumbnail");
    register("images");
  }, [register]);

  const onThumbChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewThumb(URL.createObjectURL(file));
      setValue("thumbnail", file);
    }
  };

  const handleAddImages = (files) => {
    if (galleryImgs.length + files.length > 40) {
      alert("You can upload up to 40 images.");
      return;
    }
    const newImgs = files.map((file) => ({
      src: URL.createObjectURL(file),
      file,
      isOld: false,
    }));
    setGalleryImgs((imgs) => [...imgs, ...newImgs]);
  };

  const handleImgInput = (e) => {
    const files = Array.from(e.target.files);
    handleAddImages(files);
  };

  const handleRemoveImg = (idx) => {
    setGalleryImgs((imgs) => imgs.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data) => {
    setShowLoader(true);
    const formData = new FormData();

    // Always append thumbnail — fallback to empty if missing
    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    // Filter and append only new files
    const newImages = galleryImgs.filter((img) => !img.isOld && img.file);

    if (newImages.length === 0) {
      alert("Please upload at least one image.");
      setShowLoader(false);
      return;
    }

    newImages.forEach((img) => formData.append("images", img.file));

    const method = initial.id ? "PUT" : "POST";
    const url = initial.id
      ? `${API}/api/admin/ig-comics/${initial.id}`
      : `${API}/api/admin/ig-comics`;

    const res = await fetch(url, { method, body: formData });
    setShowLoader(false);

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err?.error || "Unknown error"}`);
      return;
    }

    afterSave && afterSave();
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
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <PhotoIcon className="w-6 h-6 text-pink-400" />
          {initial.id ? "Edit Comic" : "Add Comic"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-white mb-1">Thumbnail</label>
            <input type="file" accept="image/*" onChange={onThumbChange} />
            {previewThumb && (
              <img
                src={previewThumb}
                alt="Thumbnail preview"
                className="w-24 h-24 mt-2 object-cover rounded-lg border"
              />
            )}
          </div>

          <div>
            <label className="block text-white mb-1">Images (max 40)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImgInput}
              ref={fileInputRef}
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {galleryImgs.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group shadow rounded border overflow-hidden"
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImg(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || showLoader}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-3"
          >
            {showLoader ? (
              <>
                <FaSpinner className="animate-spin" />
                {initial.id ? "Updating..." : "Creating..."}
              </>
            ) : initial.id ? (
              "Update Comic"
            ) : (
              "Create Comic"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
