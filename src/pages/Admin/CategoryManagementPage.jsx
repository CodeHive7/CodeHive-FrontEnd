import { useState, useEffect } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../services/adminService/adminService.js";
import { Trash2, Pencil, PlusCircle, Check, X, Tag, Layers } from "lucide-react";
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
            title: "Confirm Deletion",
            text: "This action cannot be undone. If this category is in use, deletion will fail.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "category.delete()",
            cancelButtonText: "cancel()",
        });
        if(result.isConfirmed) {
            try {
                await deleteCategory(categoryId);
                await loadCategories();

                Swal.fire({
                    icon: "success",
                    title: "Category Deleted",
                    text: "category.delete() completed successfully",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Operation Failed",
                    html: "<span style='font-family:monospace'>Error: Category is referenced by existing projects</span>",
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.categories</span>
                <span className="text-amber-400">.manage()</span>
            </h2>

            {/* Add Category */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md p-6">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// add new category</h3>
                    <Tag className="h-5 w-5 text-amber-400" />
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="category.name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md flex-1 border border-gray-700 focus:border-amber-500 focus:outline-none font-mono"
                    />
                    <button
                        onClick={handleCreateCategory}
                        className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md flex items-center transition-colors font-mono"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" /> category.create()
                    </button>
                </div>
            </div>

            {/* Categories List */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// existing categories</h3>
                    <div className="flex items-center">
                        <Layers className="h-4 w-4 text-amber-400 mr-2" />
                        <span className="text-xs text-amber-400/70 font-mono">categories.length: {categories.length}</span>
                    </div>
                </div>
                <div className="p-6 pt-2">
                    <ul className="divide-y divide-amber-500/10">
                        {categories.map((category) => (
                            <li key={category.id} className="flex justify-between items-center py-3">
                                {editingCategory === category.id ? (
                                    <input
                                        type="text"
                                        value={editedCategoryName}
                                        onChange={(e) => setEditedCategoryName(e.target.value)}
                                        className="bg-gray-800 text-white px-4 py-2 rounded-md flex-1 border border-gray-700 focus:border-amber-500 focus:outline-none font-mono"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <span className="text-amber-400/70 font-mono text-sm mr-2">.name =</span>
                                        <span className="text-white text-lg font-mono">"{category.name}"</span>
                                    </div>
                                )}
                                <div className="flex space-x-3">
                                    {editingCategory === category.id ? (
                                        <>
                                            <button 
                                                onClick={handleUpdateCategory} 
                                                className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                                title="Save Changes"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setEditingCategory(null)} 
                                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                                title="Cancel"
                                            >
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
                                                className="p-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-md"
                                                title="Edit Category"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}

                        {categories.length === 0 && (
                            <li className="py-4 text-center text-gray-400 font-mono">
                                // categories.length === 0
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}