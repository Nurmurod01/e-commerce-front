"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3004/",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Categories",
    "Products",
    "Orders",
    "OrderItems",
    "CartItems",
    "Payments",
  ],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Users"],
    }),

    getCategories: builder.query({
      query: () => ({
        url: "/categories",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: category,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Categories"],
    }),

    getProducts: builder.query({
      query: () => ({
        url: "/products",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Products"],
    }),
    getOneProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Products"],
    }),

    getOrders: builder.query({
      query: () => ({
        url: "/orders",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Orders"],
    }),
    getOneOrders: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Orders"],
    }),
    addOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { status },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Orders"],
    }),
    logIn: builder.mutation({
      query: (data) => ({ url: "/auth/login", method: "POST", body: data }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  useGetProductsQuery,
  useGetOneProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  useGetOrdersQuery,
  useGetOneOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,

  useLogInMutation,
} = api;

export default api;
