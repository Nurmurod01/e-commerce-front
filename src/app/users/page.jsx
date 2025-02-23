"use client";

import { useState } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/lib/service/api";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateUser({ id: editId, ...form });
      setEditId(null);
    } else {
      await addUser(form);
    }
    setForm({ name: "", email: "", role: "user" });
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Failed to load users.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">User Management</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
        <Input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Username"
          className="w-full"
        />
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full"
        />
        <Select
          value={form.role}
          onValueChange={(value) => setForm({ ...form, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">{editId ? "Update" : "Add"}</Button>
      </form>

      <ul className="space-y-2">
        {users?.map((user) => (
          <li
            key={user.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <span>
              {user.name} ({user.role})
            </span>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(user)} variant="outline">
                Edit
              </Button>
              <Button onClick={() => deleteUser(user.id)} variant="destructive">
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
