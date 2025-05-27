import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const API = import.meta.env.VITE_OPEN_APIURL;

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `${API.replace(/\/$/, "")}${imageUrl}`;
};

const AdminUpdateArticles = () => {
  const [articles, setArticles] = useState([]);
  const [addRow, setAddRow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    link: "",
    image: null,
    image_url: "",
  });
  const [editingData, setEditingData] = useState({});

  useEffect(() => {
    fetchArticles();
  }, []);
  const fetchArticles = async () => {
    const res = await axios.get(`${API}/api/articles`);
    setArticles(res.data);
  };

  // PRODUCT CRUD
  const handleImage = (e, setData) => {
    const file = e.target.files[0];
    if (file) setData((prev) => ({ ...prev, image: file }));
  };

  const addArticle = async () => {
    if (!newArticle.title || !newArticle.link || !newArticle.image) {
      Swal.fire("Fill all fields!", "", "error");
      return;
    }
    const form = new FormData();
    form.append("title", newArticle.title);
    form.append("link", newArticle.link);
    form.append("image", newArticle.image);
    await axios.post(`${API}/api/articles`, form, { withCredentials: true });
    setAddRow(false);
    setNewArticle({ title: "", link: "", image: null });
    fetchArticles();
    Swal.fire("Added!", "Article added.", "success");
  };

  const startEditArticle = (a) => {
    setEditingId(a.id);
    setEditingData({
      ...a,
      image: null,
    });
  };

  const saveEditArticle = async () => {
    if (!editingData.title || !editingData.link) {
      Swal.fire("Fill all fields!", "", "error");
      return;
    }
    const form = new FormData();
    form.append("title", editingData.title);
    form.append("link", editingData.link);
    // Only append image if changed
    if (editingData.image) form.append("image", editingData.image);
    else form.append("image_url", editingData.image_url);
    await axios.put(`${API}/api/articles/${editingId}`, form, {
      withCredentials: true,
    });
    setEditingId(null);
    setEditingData({});
    fetchArticles();
    Swal.fire("Updated!", "Article updated.", "success");
  };

  const deleteArticle = async (id) => {
    if (
      !(await Swal.fire({ title: "Delete?", showCancelButton: true }))
        .isConfirmed
    )
      return;
    await axios.delete(`${API}/api/articles/${id}`, { withCredentials: true });
    fetchArticles();
    Swal.fire("Deleted!", "Article deleted.", "success");
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-6">Manage Articles</h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Articles</h2>
        <button
          className="bg-green-700 text-white px-3 py-1 rounded"
          onClick={() => setAddRow(true)}
        >
          <FaPlus /> Add Article
        </button>
      </div>
      <div className="overflow-x-auto shadow bg-gray-900 rounded">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Link</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {addRow && (
              <tr className="bg-gray-800">
                <td className="p-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e, setNewArticle)}
                  />
                  {newArticle.image && (
                    <img
                      src={URL.createObjectURL(newArticle.image)}
                      alt="preview"
                      className="w-16 h-16 mt-2 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2">
                  <input
                    className="p-1 rounded bg-gray-700 text-white w-full"
                    value={newArticle.title}
                    onChange={(e) =>
                      setNewArticle((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Article Title"
                  />
                </td>
                <td className="p-2">
                  <input
                    className="p-1 rounded bg-gray-700 text-white w-full"
                    value={newArticle.link}
                    onChange={(e) =>
                      setNewArticle((p) => ({ ...p, link: e.target.value }))
                    }
                    placeholder="Article Link"
                  />
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    className="bg-green-600 text-white px-2 rounded"
                    onClick={addArticle}
                  >
                    <FaSave />
                  </button>
                  <button
                    className="bg-gray-600 text-white px-2 rounded"
                    onClick={() => setAddRow(false)}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            )}
            {articles.map((article) =>
              editingId === article.id ? (
                <tr key={article.id} className="bg-gray-800">
                  <td className="p-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage(e, setEditingData)}
                    />
                    <img
                      src={
                        editingData.image
                          ? URL.createObjectURL(editingData.image)
                          : getImageUrl(article.image_url)
                      }
                      alt={article.title}
                      className="w-16 h-16 mt-2 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="p-1 rounded bg-gray-700 text-white w-full"
                      value={editingData.title}
                      onChange={(e) =>
                        setEditingData((p) => ({
                          ...p,
                          title: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="p-1 rounded bg-gray-700 text-white w-full"
                      value={editingData.link}
                      onChange={(e) =>
                        setEditingData((p) => ({
                          ...p,
                          link: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-2 rounded"
                      onClick={saveEditArticle}
                    >
                      <FaSave />
                    </button>
                    <button
                      className="bg-gray-600 text-white px-2 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={article.id} className="border-b border-gray-700">
                  <td className="p-2">
                    <img
                      src={getImageUrl(article.image_url)}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{article.title}</td>
                  <td
                    className="p-2 max-w-[180px] truncate text-blue-400"
                    title={article.link}
                  >
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.link}
                    </a>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-yellow-600 text-white px-2 rounded"
                      onClick={() => startEditArticle(article)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 rounded"
                      onClick={() => deleteArticle(article.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              )
            )}
            {articles.length === 0 && !addRow && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-6">
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUpdateArticles;
