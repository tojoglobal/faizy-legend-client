import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  XMarkIcon,
  CameraIcon,
  MapPinIcon,
  UserIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
const API = import.meta.env.VITE_OPEN_APIURL;

export default function GalleryForm({ initial = {}, onClose, afterSave }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({ defaultValues: initial });

  // Helper: Get full URL for stored images
  const getImageSrc = (src) => {
    if (!src) return "";
    if (src.startsWith("blob:")) return src;
    // Remove starting slash for consistency
    const cleanSrc = src.replace(/^(\/+)/, "");
    // If already absolute (e.g., https://), return as is
    if (/^https?:\/\//.test(src)) return src;
    // For /uploads/xxx or uploads/xxx, join with API
    return `${API}/${cleanSrc}`;
  };

  const [previewThumb, setPreviewThumb] = useState(
    initial.thumbnail ? getImageSrc(initial.thumbnail.replace("\\", "/")) : null
  );
  const [galleryImgs, setGalleryImgs] = useState(
    initial.images
      ? initial.images.map((src) => ({
          src: src.replace("\\", "/"),
          file: null, // old (from DB)
          isOld: true,
        }))
      : []
  );
  const fileInputRef = useRef();

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

  // Drag and Drop handler for images
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleAddImages(files);
  };

  const handleAddImages = (files) => {
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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("photographer", data.photographer);

    if (typeof data.thumbnail === "object") {
      formData.append("thumbnail", data.thumbnail);
    }

    // Only new images to upload
    galleryImgs.forEach((img) => {
      if (!img.isOld && img.file) formData.append("images", img.file);
    });

    // For update: send images to keep (for backend to not delete them)
    if (initial.id) {
      formData.append(
        "keepImages",
        JSON.stringify(
          galleryImgs
            .filter((i) => i.isOld)
            .map(
              (i) => i.src.replace(/^(\/+)/, "") // remove leading slash
            )
        )
      );
    }

    const method = initial.id ? "PUT" : "POST";
    const url = initial.id
      ? `${API}/api/modeling-gallery/${initial.id}`
      : `${API}/api/modeling-gallery`;

    const res = await fetch(url, { method, body: formData });
    if (!res.ok) {
      alert("Failed to save!");
      return;
    }
    afterSave && afterSave();
  };

  // Remove old image (calls backend)
  const removeOldImg = async (idx) => {
    const img = galleryImgs[idx];
    if (!img.isOld) return handleRemoveImg(idx);
    if (
      !window.confirm(
        "Remove this image from gallery? (This will delete it permanently)"
      )
    )
      return;
    const res = await fetch(`${API}/api/modeling-gallery/${initial.id}/image`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath: img.src.replace(/^(\/+)/, "") }),
    });
    if (res.ok) {
      handleRemoveImg(idx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/70 via-gray-900/80 to-slate-900/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a1a23] via-[#20202a] to-[#29293a] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-auto max-h-[95vh] border border-gray-800">
        <button
          className="absolute cursor-pointer top-5 right-5 text-gray-400 hover:text-white focus:outline-none"
          onClick={onClose}
        >
          <XMarkIcon className="w-8 h-8" />
        </button>
        <h2 className="font-extrabold text-3xl mb-8 text-white tracking-tight drop-shadow-lg flex items-center gap-2">
          <PhotoIcon className="w-8 h-8 text-pink-400" />
          {initial.id ? "Edit Gallery" : "Create Gallery"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-7"
          encType="multipart/form-data"
        >
          {/* Name */}
          <div>
            <label className="font-semibold text-gray-300 mb-1 flex items-center gap-2">
              <CameraIcon className="w-5 h-5 text-purple-400" />
              Name
            </label>
            <input
              {...register("name", { required: true })}
              className="bg-[#232334] border-2 border-[#2e2e44] focus:border-pink-400 text-white rounded-lg px-3 py-2 mt-1 w-full outline-none transition shadow"
              placeholder="Gallery name"
              required
            />
          </div>
          {/* Location */}
          <div>
            <label className="font-semibold text-gray-300 mb-1 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-emerald-400" />
              Location
            </label>
            <input
              {...register("location")}
              className="bg-[#232334] border-2 border-[#2e2e44] focus:border-emerald-400 text-white rounded-lg px-3 py-2 mt-1 w-full outline-none transition shadow"
              placeholder="City, Country"
            />
          </div>
          {/* Photographer */}
          <div>
            <label className="font-semibold text-gray-300 mb-1 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-yellow-400" />
              Photographer
            </label>
            <input
              {...register("photographer")}
              className="bg-[#232334] border-2 border-[#2e2e44] focus:border-yellow-400 text-white rounded-lg px-3 py-2 mt-1 w-full outline-none transition shadow"
              placeholder="@photographer"
            />
          </div>
          {/* Thumbnail */}
          <div>
            <label className="block font-semibold text-gray-300 mb-1">
              Thumbnail
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center space-x-2 bg-[#29293a] border-2 border-dashed border-pink-400 rounded-xl px-3 py-2 cursor-pointer hover:bg-[#232334] transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onThumbChange}
                />
                <span className="text-pink-300 font-semibold">Choose</span>
              </label>
              {previewThumb && (
                <img
                  src={previewThumb}
                  alt="Thumbnail preview"
                  className="w-20 h-20 object-cover rounded-xl border-[3px] border-pink-400 shadow-lg"
                />
              )}
            </div>
          </div>
          {/* Gallery Images */}
          <div>
            <label className="block font-semibold text-gray-300 mb-1">
              Gallery Images
            </label>
            <div
              className="relative border-2 border-dashed border-blue-400 rounded-2xl p-6 text-center cursor-pointer bg-gradient-to-br from-[#232334] to-[#252543] hover:from-[#1e1e2e] transition group"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleImgInput}
              />
              <span className="text-blue-200">
                <span className="font-bold">Drag & drop</span> or{" "}
                <span className="underline">click</span> to select images (max
                40+)
              </span>
              <div className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none group-hover:bg-blue-400/10 transition"></div>
            </div>
            {/* Preview */}
            <div className="flex flex-wrap gap-4 mt-4">
              {galleryImgs.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group shadow-md rounded-2xl border-[2.5px] border-blue-300 bg-[#181828] overflow-hidden"
                >
                  <img
                    src={getImageSrc(img.src)}
                    alt=""
                    className="w-24 h-24 object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      img.isOld ? removeOldImg(idx) : handleRemoveImg(idx)
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition"
                    title="Remove"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold text-lg tracking-wide shadow-xl transition"
          >
            {initial.id ? "Update Gallery" : "Create Gallery"}
          </button>
        </form>
      </div>
    </div>
  );
}
