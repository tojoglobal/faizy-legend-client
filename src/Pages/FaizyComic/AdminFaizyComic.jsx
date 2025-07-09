import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AdminFaizyComic = () => {
  const queryClient = useQueryClient();
  const axiosPublicUrl = useAxiospublic();
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  // GET existing comic (assuming only one)
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">
        {comic ? "Edit" : "Upload"} Faizy Comic
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 bg-gray-900 p-6 rounded-lg"
      >
        <input
          {...register("title", { required: true })}
          placeholder="Title"
          className="input input-bordered"
        />
        <input
          {...register("subtitle")}
          placeholder="Subtitle"
          className="input input-bordered"
        />
        <input
          {...register("follow_url")}
          placeholder="Follow URL"
          className="input input-bordered"
        />
        <textarea
          {...register("description")}
          placeholder="Description"
          className="textarea textarea-bordered"
        />
        <input
          type="file"
          {...register("images")}
          accept="image/*"
          multiple
          className="file-input file-input-bordered"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {comic?.images &&
            JSON.parse(comic.images).map((img, i) => (
              <div key={i} className="relative mt-2 w-full h-52">
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${img}`}
                  alt={`Comic Image ${i + 1}`}
                  className="rounded w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!comic?.id && !comic?._id) return;
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
                          {
                            data: { image: img }, // send image path in body
                          }
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
                  className="absolute top-1 right-1 bg-red-600 cursor-pointer rounded-full px-2 text-white hover:bg-red-800 z-10"
                  aria-label="Delete image"
                  title="Delete Image"
                >
                  &times;
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-4">
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
