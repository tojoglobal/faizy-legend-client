import { XCircle, CheckCircle2, TrashIcon } from "lucide-react";
import ReactPlayer from "react-player";
import clsx from "clsx";

export default function FanArtDetailsModal({
  open,
  onClose,
  art,
  onApprove,
  onReject,
  onDelete,
}) {
  if (!open || !art) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white rounded-3xl shadow-2xl max-w-3xl w-full relative overflow-auto max-h-[90vh] p-7 border border-gray-800"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 6px 0 rgba(0,0,0,0.19)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-white p-2 transition"
          title="Close"
        >
          <XCircle className="w-7 h-7" />
        </button>
        <h3 className="text-3xl font-bold mb-4 tracking-tight text-center">
          {art.title || "Fan Art Submission"}
        </h3>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
          <span>
            <span className="font-semibold text-white">By:</span> {art.user}
          </span>
          <span className="text-gray-500">|</span>
          <span>
            <span className="font-semibold text-white">Date:</span>{" "}
            {art.created_at ? new Date(art.created_at).toLocaleString() : ""}
          </span>
        </div>
        {art.tags?.length > 0 && (
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {art.tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {art.images?.map((img, i) => (
            <img
              key={img}
              src={
                img.startsWith("http")
                  ? img
                  : `${import.meta.env.VITE_OPEN_APIURL}${img}`
              }
              alt={`Fan Art Image ${i + 1}`}
              className="rounded-xl w-full h-52 object-cover border border-gray-800 shadow-lg"
            />
          ))}

          {art.videos?.map((vid) => {
            const videoUrl = vid.startsWith("http")
              ? vid
              : `${import.meta.env.VITE_OPEN_APIURL}${vid}`;
            return (
              <div
                key={vid}
                className="w-full rounded-xl overflow-hidden border border-gray-800 shadow-lg"
              >
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="100%"
                  height="220px"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {art.approved === null && (
            <>
              <button
                className={clsx(
                  "flex items-center gap-2 px-5 py-2 cursor-pointer rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow"
                )}
                onClick={() => {
                  onApprove?.(art.id);
                  onClose();
                }}
              >
                <CheckCircle2 className="w-5 h-5" /> Approve
              </button>
              <button
                className={clsx(
                  "flex items-center gap-2 px-5 py-2 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow"
                )}
                onClick={() => {
                  onReject?.(art.id);
                  onClose();
                }}
              >
                <XCircle className="w-5 h-5" /> Reject
              </button>
            </>
          )}
          <button
            className={clsx(
              "flex items-center gap-2 px-5 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-800 text-white font-medium shadow"
            )}
            onClick={() => {
              onDelete?.(art.id);
              onClose();
            }}
          >
            <TrashIcon className="w-5 h-5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
