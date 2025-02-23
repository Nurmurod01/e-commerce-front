"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/Loading";

export default function CategoryPage() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateCategory({ id: editId, name });
      setEditId(null);
    } else {
      await addCategory({ name });
    }
    setName("");
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setName(category.name);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading categories.</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Categories</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center space-x-2 w-full"
      >
        <label className="text-center font-medium text-lg w-[350px]">
          Create category
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
        <Button type="submit">{editId ? "Update" : "Add"}</Button>
      </form>
      <div className="space-y-2">
        {categories?.map((category) => (
          <Card
            key={category.id}
            className="p-4 flex justify-between items-center"
          >
            <span>{category.name}</span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleEdit(category)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteCategory(category.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
