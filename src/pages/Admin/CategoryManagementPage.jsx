import { useState, useEffect } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../services/adminService/adminService.js";
import { Trash2, Pencil, PlusCircle, Check, X } from "lucide-react";

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories", error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) return;
        await createCategory(newCategory, loadCategories);
        setNewCategory("");
    };

    const handleUpdateCategory = async () => {
        if (!editedCategoryName.trim() || !editingCategory) return;
        await updateCategory(editingCategory, editedCategoryName, loadCategories);
        setEditingCategory(null);
        setEditedCategoryName("");
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            await deleteCategory(categoryId, loadCategories);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-4">Category Management</h1>

            {/* Add Category */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="New Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md flex-1"
                />
                <button onClick={handleCreateCategory} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
                    <PlusCircle className="w-5 h-5 mr-1" /> Add
                </button>
            </div>

            {/* Categories List */}
            <div className="bg-[#1C1F2E] p-6 rounded-md shadow-md border border-gray-700">
                <h2 className="text-lg font-bold text-white mb-4">Existing Categories</h2>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id} className="flex justify-between items-center p-2 border-b border-gray-700">
                            {editingCategory === category.id ? (
                                <input
                                    type="text"
                                    value={editedCategoryName}
                                    onChange={(e) => setEditedCategoryName(e.target.value)}
                                    className="bg-gray-800 text-white px-2 py-1 rounded-md flex-1"
                                />
                            ) : (
                                <span className="text-white">{category.name}</span>
                            )}
                            <div className="flex space-x-2">
                                {editingCategory === category.id ? (
                                    <>
                                        <button onClick={handleUpdateCategory} className="text-green-500 hover:text-green-700">
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setEditingCategory(null)} className="text-red-500 hover:text-red-700">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingCategory(category.id);
                                                setEditedCategoryName(category.name);
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
