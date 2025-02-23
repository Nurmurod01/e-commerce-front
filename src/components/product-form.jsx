"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/lib/service/api";
import { Loading } from "./Loading";
import { ErrorMessage } from "./ErrorMessage";

export function ProductManager() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [description, setDescription] = useState("");

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="Error loading products!" />;
  if (!products || !Array.isArray(products))
    return <ErrorMessage message="No products found!" />;

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || (!imgUrl && !editingProduct)) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", String(Number(price)));
      formData.append("categoryId", category);
      formData.append("description", description);

      if (editingProduct && !imgUrl) {
        formData.append("imgUrl", editingProduct.imgUrl);
      } else if (imgUrl) {
        formData.append("imgUrl", imgUrl);
      }

      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          data: formData,
        }).unwrap();
      } else {
        console.log(imgUrl);
        console.log(formData);
        await addProduct(formData).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Check console for details.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category?.id || "");
    setImgUrl(null);
    setDescription(product.description);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setCategory("");
    setImgUrl(null);
    setDescription("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product Management</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="imgUrl">Image</Label>
          <Input
            id="imgUrl"
            type="file"
            accept="image/*"
            onChange={(e) => setImgUrl(e.target.files[0])}
            required={!editingProduct}
          />
          {editingProduct && editingProduct.imgUrl && (
            <p className="text-sm text-gray-500">
              Current image: {editingProduct.imgUrl}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        <Button type="submit">{editingProduct ? "Update" : "Save"}</Button>
        {editingProduct && (
          <Button type="button" onClick={resetForm} className="ml-2">
            Cancel
          </Button>
        )}
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.category?.name || "Unknown"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
