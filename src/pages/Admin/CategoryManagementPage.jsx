import { useState, useEffect } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../services/adminService/adminService.js";
import { Trash2, Pencil, PlusCircle, Check, X } from "lucide-react";
import Swal from "sweetalert2";

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
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone. If this category is in use, deletion will fail.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        });
        if(result.isConfirmed) {
            try {
                await deleteCategory(categoryId);
                await loadCategories();

                Swal.fire({
                    icon: "success",
                    title: "Category Deleted",
                    text: "The category has been deleted successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Deletion Failed",
                    text: error.response?.data || "This Category is in use and cannot be deleted.",
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 Category Management</h2>

            {/* Add Category */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h3 className="text-sm font-medium text-gray-400">Add New Category</h3>
                    <PlusCircle className="h-5 w-5 text-yellow-400" />
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="New Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md flex-1 border border-gray-700 focus:border-yellow-500 focus:outline-none"
                    />
                    <button
                        onClick={handleCreateCategory}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" /> Add Category
                    </button>
                </div>
            </div>

            {/* Categories List */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                <div className="p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">Existing Categories</h3>
                </div>
                <div className="p-6 pt-2">
                    <ul className="divide-y divide-gray-700">
                        {categories.map((category) => (
                            <li key={category.id} className="flex justify-between items-center py-3">
                                {editingCategory === category.id ? (
                                    <input
                                        type="text"
                                        value={editedCategoryName}
                                        onChange={(e) => setEditedCategoryName(e.target.value)}
                                        className="bg-gray-800 text-white px-4 py-2 rounded-md flex-1 border border-gray-700 focus:border-yellow-500 focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-white text-lg">{category.name}</span>
                                )}
                                <div className="flex space-x-3">
                                    {editingCategory === category.id ? (
                                        <>
                                            <button onClick={handleUpdateCategory} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingCategory(null)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category.id);
                                                    setEditedCategoryName(category.name);
                                                }}
                                                className="p-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}

                        {categories.length === 0 && (
                            <li className="py-4 text-center text-gray-400">
                                No categories found. Create one to get started.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}