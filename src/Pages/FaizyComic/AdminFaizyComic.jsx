import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Link } from "react-router-dom";

const AdminFaizyComic = () => {
  const queryClient = useQueryClient();
  const axiosPublicUrl = useAxiospublic();
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data: comic } = useQuery({
    queryKey: ["faizy-comics"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/faizy-comic");
      return res.data?.[0]; // Get the latest/only comic
    },
  });

  // Pre-fill form if comic exists
  useEffect(() => {
    if (comic) {
      setValue("title", comic.title);
      setValue("subtitle", comic.subtitle);
      setValue("description", comic.description);
      setValue("follow_url", comic.follow_url);
      setValue("shop_url", comic.shop_url);
    }
  }, [comic, setValue]);

  // CREATE or UPDATE mutation
  const saveComic = useMutation({
    mutationFn: async (formData) => {
      const hasId = comic?._id || comic?.id;
      if (hasId) {
        return await axiosPublicUrl.put(`/api/faizy-comic/${hasId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        return await axiosPublicUrl.post("/api/faizy-comic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["faizy-comics"]);
      Swal.fire(
        "Success",
        comic ? "Comic updated!" : "Comic uploaded!",
        "success"
      );
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.error || "Save failed", "error");
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subtitle", data.subtitle);
    formData.append("description", data.description);
    formData.append("follow_url", data.follow_url);
    formData.append("shop_url", data.shop_url);
    if (data.images?.length > 0) {
      Array.from(data.images).forEach((img) => formData.append("images", img));
    }

    setUploading(true);
    saveComic.mutate(formData);
  };

  const handleDelete = async () => {
    const id = comic?._id || comic?.id;
    if (!id) return;
    const confirm = await Swal.fire({
      title: "Delete Comic?",
      text: "This will delete the comic permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });
    if (confirm.isConfirmed) {
      await axiosPublicUrl.delete(`/api/faizy-comic/${id}`);
      queryClient.invalidateQueries(["faizy-comics"]);
      reset();
    }
  };

  return (
    <div className="p-1 lg:p-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-2">
          {comic ? "Edit" : "Upload"} Faizy Comic (HomePage)
        </h2>
        <Link
          to="/dashboard/faizy/ig-comics"
          className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded font-medium transition"
        >
          IG Comics
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900 p-1 lg:p-3 rounded-lg"
      >
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="label text-white font-semibold">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: true })}
            placeholder="Enter title"
            className="input input-bordered w-full"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col">
          <label htmlFor="subtitle" className="label text-white font-semibold">
            Subtitle
          </label>
          <input
            id="subtitle"
            {...register("subtitle")}
            placeholder="Enter subtitle"
            className="input input-bordered w-full"
          />
        </div>

        {/* Follow URL */}
        <div className="flex flex-col">
          <label
            htmlFor="follow_url"
            className="label text-white font-semibold"
          >
            Follow URL
          </label>
          <input
            id="follow_url"
            {...register("follow_url")}
            placeholder="https://instagram.com/faizycomic"
            className="input input-bordered w-full"
          />
        </div>
        {/* Shop URL */}
        <div className="flex flex-col">
          <label htmlFor="shop_url" className="label text-white font-semibold">
            Shop URL
          </label>
          <input
            id="shop_url"
            {...register("shop_url")}
            placeholder=""
            className="input input-bordered w-full"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col">
          <label htmlFor="images" className="label text-white font-semibold">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            {...register("images")}
            accept="image/*"
            multiple
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 flex flex-col">
          <label
            htmlFor="description"
            className="label text-white font-semibold"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Enter comic description"
            className="textarea textarea-bordered w-full"
            rows={6}
          />
        </div>

        {/* Preview Images with Delete Button */}
        {comic?.images && (
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JSON.parse(comic.images).map((img, i) => (
              <div key={i} className="relative h-40 w-full">
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${img}`}
                  alt={`Comic Image ${i + 1}`}
                  className="rounded object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const confirm = await Swal.fire({
                      title: "Delete Image?",
                      text: "This will remove this image from the comic.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      confirmButtonText: "Delete",
                    });
                    if (confirm.isConfirmed) {
                      try {
                        await axiosPublicUrl.delete(
                          `/api/faizy-comic/${comic.id || comic._id}/image`,
                          { data: { image: img } }
                        );
                        Swal.fire(
                          "Deleted!",
                          "Image has been removed.",
                          "success"
                        );
                        queryClient.invalidateQueries(["faizy-comics"]);
                      } catch (error) {
                        Swal.fire(
                          "Error",
                          error.response?.data?.error ||
                            "Failed to delete image",
                          "error"
                        );
                      }
                    }
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 hover:bg-red-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-success"
          >
            {uploading ? "Saving..." : comic ? "Update Comic" : "Upload Comic"}
          </button>

          {comic && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error"
            >
              Delete Comic
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminFaizyComic;
