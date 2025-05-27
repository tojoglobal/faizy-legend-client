import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const API = import.meta.env.VITE_OPEN_APIURL;

// Utility to get absolute image url
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `${API.replace(/\/$/, "")}${imageUrl}`;
};

const fetchCategories = async () => {
  const res = await axios.get(`${API}/api/shopping/categories`);
  return res.data;
};

const fetchProducts = async () => {
  const res = await axios.get(`${API}/api/shopping/products`);
  return res.data;
};

const AdminUpdateShopping = () => {
  // Category state
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");

  // Product state
  const [products, setProducts] = useState([]);
  const [addRow, setAddRow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: null,
    image_url: "",
    category_id: "",
    link: "",
  });
  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts().then(setProducts);
  }, []);

  // CATEGORY CRUD
  const addCategory = async () => {
    if (!newCategory) return;
    await axios.post(
      `${API}/api/shopping/categories`,
      { name: newCategory },
      { withCredentials: true }
    );
    setNewCategory("");
    fetchCategories().then(setCategories);
    Swal.fire("Added!", "Category added.", "success");
  };
  const saveEditCategory = async (cat) => {
    await axios.put(
      `${API}/api/shopping/categories/${cat.id}`,
      { name: editingCatName },
      { withCredentials: true }
    );
    setEditingCatId(null);
    setEditingCatName("");
    fetchCategories().then(setCategories);
    Swal.fire("Updated!", "Category updated.", "success");
  };
  const deleteCategory = async (id) => {
    if (
      !(await Swal.fire({ title: "Delete?", showCancelButton: true }))
        .isConfirmed
    )
      return;
    await axios.delete(`${API}/api/shopping/categories/${id}`, {
      withCredentials: true,
    });
    fetchCategories().then(setCategories);
    Swal.fire("Deleted!", "Category deleted.", "success");
  };

  // PRODUCT CRUD
  const handleImage = (e, setData) => {
    const file = e.target.files[0];
    if (file) setData((prev) => ({ ...prev, image: file }));
  };
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.image || !newProduct.category_id) {
      Swal.fire("Fill all fields!", "", "error");
      return;
    }
    const form = new FormData();
    form.append("name", newProduct.name);
    form.append("image", newProduct.image);
    form.append("category_id", newProduct.category_id);
    form.append("link", newProduct.link);
    await axios.post(`${API}/api/shopping/products`, form, {
      withCredentials: true,
    });
    setAddRow(false);
    setNewProduct({
      name: "",
      image: null,
      image_url: "",
      category_id: "",
      link: "",
    });
    fetchProducts().then(setProducts);
    Swal.fire("Added!", "Product added.", "success");
  };
  const startEditProduct = (p) => {
    setEditingId(p.id);
    setEditingData({
      ...p,
      image: null, // new image (if uploaded)
    });
  };
  const saveEditProduct = async () => {
    if (!editingData.name || !editingData.category_id) {
      Swal.fire("Fill all fields!", "", "error");
      return;
    }
    const form = new FormData();
    form.append("name", editingData.name);
    form.append("category_id", editingData.category_id);
    form.append("link", editingData.link);
    if (editingData.image) form.append("image", editingData.image);
    else form.append("image_url", editingData.image_url);
    await axios.put(`${API}/api/shopping/products/${editingId}`, form, {
      withCredentials: true,
    });
    setEditingId(null);
    setEditingData({});
    fetchProducts().then(setProducts);
    Swal.fire("Updated!", "Product updated.", "success");
  };
  const deleteProduct = async (id) => {
    if (
      !(await Swal.fire({ title: "Delete?", showCancelButton: true }))
        .isConfirmed
    )
      return;
    await axios.delete(`${API}/api/shopping/products/${id}`, {
      withCredentials: true,
    });
    fetchProducts().then(setProducts);
    Swal.fire("Deleted!", "Product deleted.", "success");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Manage Shop</h1>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <div className="flex gap-2 mb-2">
          <input
            className="p-1 rounded bg-gray-800 text-white"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
          />
          <button
            className="bg-green-700 cursor-pointer text-white px-3 py-1 rounded"
            onClick={addCategory}
          >
            <FaPlus />
          </button>
        </div>
        <ul className="space-y-1">
          {categories?.map((cat, idx) =>
            editingCatId === cat.id ? (
              <li key={cat.id} className="flex gap-2 items-center">
                <input
                  className="p-1 rounded bg-gray-800 text-white"
                  value={editingCatName}
                  onChange={(e) => setEditingCatName(e.target.value)}
                />
                <button
                  className="bg-green-600 cursor-pointer text-white px-2 py-[2px] rounded"
                  onClick={() => saveEditCategory(cat)}
                >
                  <FaSave />
                </button>
                <button
                  className="bg-gray-600 cursor-pointer text-white px-2 py-[2px] rounded"
                  onClick={() => setEditingCatId(null)}
                >
                  <FaTimes />
                </button>
              </li>
            ) : (
              <li key={cat.id} className="flex gap-2 items-center">
                {idx + 1}. <span>{cat.name}</span>
                <button
                  className="bg-yellow-600 cursor-pointer text-white px-2 py-[2px] rounded"
                  onClick={() => {
                    setEditingCatId(cat.id);
                    setEditingCatName(cat.name);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="bg-red-600 cursor-pointer text-white px-2 py-[2px] rounded"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <FaTrash />
                </button>
              </li>
            )
          )}
        </ul>
      </div>
      {/* Products Management */}
      <div>
        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
          <h2 className="text-xl font-semibold">Products</h2>
          <button
            className="bg-teal-700 cursor-pointer text-white flex items-center gap-1 px-3 py-1 rounded"
            onClick={() => setAddRow(true)}
          >
            <FaPlus /> Add Product
          </button>
        </div>
        <div className="w-full shadow rounded bg-gray-900 overflow-hidden">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col style={{ width: "80px" }} />
              <col style={{ width: "170px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "230px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Link</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addRow && (
                <tr className="bg-gray-800">
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage(e, setNewProduct)}
                    />
                    {newProduct.image && (
                      <img
                        src={URL.createObjectURL(newProduct.image)}
                        alt="preview"
                        className="w-16 h-16 mt-2 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2">
                    <input
                      className="p-1 rounded bg-gray-700 text-white w-full"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Product Name"
                      maxLength={80}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="p-1 rounded cursor-pointer bg-gray-700 text-white w-full"
                      value={newProduct.category_id}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          category_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      className="p-1 rounded bg-gray-700 text-white w-full truncate"
                      value={newProduct.link}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, link: e.target.value }))
                      }
                      placeholder="Product Link"
                      maxLength={120}
                    />
                  </td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      className="bg-green-600 flex items-center gap-1 cursor-pointer text-white px-2 py-[2px] rounded"
                      onClick={addProduct}
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      className="bg-gray-600 flex items-center gap-1 cursor-pointer text-white px-2 py-[2px] rounded"
                      onClick={() => setAddRow(false)}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </td>
                </tr>
              )}
              {products.map((product) =>
                editingId === product.id ? (
                  <tr key={product.id} className="bg-gray-800">
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
                            : getImageUrl(product.image_url)
                        }
                        alt={product.name}
                        className="w-16 h-16 mt-2 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className="p-1 rounded bg-gray-700 text-white w-full"
                        value={editingData.name}
                        onChange={(e) =>
                          setEditingData((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        maxLength={80}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className="p-1 rounded cursor-pointer bg-gray-700 text-white w-full"
                        value={editingData.category_id}
                        onChange={(e) =>
                          setEditingData((p) => ({
                            ...p,
                            category_id: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {categories.map((cat) => (
                          <option value={cat.id} key={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        className="p-1 rounded bg-gray-700 text-white w-full truncate"
                        value={editingData.link}
                        onChange={(e) =>
                          setEditingData((p) => ({
                            ...p,
                            link: e.target.value,
                          }))
                        }
                        maxLength={120}
                      />
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="bg-green-600 flex items-center gap-1 cursor-pointer text-white px-2 py-[2px] rounded"
                        onClick={saveEditProduct}
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        className="bg-gray-600 flex items-center gap-1 cursor-pointer text-white px-2 py-[2px] rounded"
                        onClick={() => setEditingId(null)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={product.id} className="border-b border-gray-700">
                    <td className="p-2">
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category_name}</td>
                    <td
                      className="p-2 max-w-[170px] truncate text-xs text-blue-300"
                      title={product.link}
                    >
                      {product.link}
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        className="bg-yellow-600 cursor-pointer text-white px-2 py-[2px] rounded"
                        onClick={() => startEditProduct(product)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-600 cursor-pointer text-white px-2 py-[2px] rounded"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateShopping;
