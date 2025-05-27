import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaEye } from "react-icons/fa";

const API = import.meta.env.VITE_OPEN_APIURL;

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `${API.replace(/\/$/, "")}${imageUrl}`;
};

const AdminBookData = () => {
  const [forms, setForms] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await axios.get(`${API}/api/book-form`, {
      withCredentials: true,
    });
    setForms(res.data);
  };
  const deleteForm = async (id) => {
    if (
      !(
        await Swal.fire({ title: "Delete this entry?", showCancelButton: true })
      ).isConfirmed
    )
      return;
    await axios.delete(`${API}/api/book-form/${id}`, { withCredentials: true });
    fetchData();
    Swal.fire("Deleted!", "", "success");
  };

  const showMessage = (name, message) => {
    Swal.fire({
      title: `Message from ${name}`,
      html: `<div style="max-height:40vh;overflow-y:auto;text-align:left;word-break:break-word;">${message
        .replace(/\n/g, "<br>")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</div>`,
      width: 600,
      confirmButtonText: "Close",
      customClass: {
        htmlContainer: "swal2-message-html",
      },
    });
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-6">Book Form Submissions</h1>
      <div className="overflow-x-auto bg-gray-900 rounded shadow">
        <table className="min-w-full table-auto border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-left text-white">
              <th className="p-2">Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Message</th>
              <th className="p-2">Image</th>
              <th className="p-2">Submitted</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((f) => (
              <tr key={f.id} className="border-b border-gray-700">
                <td className="p-2">{f.name}</td>
                <td className="p-2">{f.last_name}</td>
                <td className="p-2">{f.email}</td>
                <td className="p-2 max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis">
                  <button
                    className="flex cursor-pointer items-center gap-1 text-blue-400 hover:underline"
                    title="View message"
                    onClick={() => showMessage(f.name, f.message)}
                  >
                    <FaEye />
                    View
                  </button>
                </td>
                <td className="p-2">
                  {f.image_url ? (
                    <a
                      href={getImageUrl(f.image_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={getImageUrl(f.image_url)}
                        alt="attachment"
                        className="w-16 h-12 object-cover rounded-sm"
                      />
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 text-xs text-gray-300">
                  {new Date(f.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    className="bg-red-600 cursor-pointer text-white px-2 py-1 rounded"
                    onClick={() => deleteForm(f.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {forms.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookData;
