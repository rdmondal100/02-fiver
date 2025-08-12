"use client";

import axiosInstance from "@/config/axiosConfig";
import { useState } from "react";
import toast from "react-hot-toast";
import BlogForm from "./blog/BlogForm";
import BlogList from "./blog/BlogList";
// import BlogList from './BlogList';
// import BlogForm from './BlogForm';

const Blog = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isLoader, setLoader] = useState(1)

  // Function to handle blog creation or update // adjust path as needed

  const handleFormSubmit = async (data) => {
    const method = editingBlog ? "put" : "post";
    const url = editingBlog
      ? `/blogs/${editingBlog.id}`
      : `/blogs`;

    try {
      const response = await axiosInstance({
        method,
        url,
        data,
      });

      const responseData = response.data;
      setShowForm(false);
      setEditingBlog(null);

      console.log(responseData);

      if (responseData) {
        toast.success(responseData.message || "Operation successful");
      }

      setLoader(isLoader + 1);
    } catch (error) {
      console.error("Error saving blog:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };


  // Function to delete a blog
  const handleDeleteBlog = async (id) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      // You can trigger blog list refresh here
      setLoader(isLoader + 1)
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Blog List */}
      <BlogList
        onEdit={(blog) => {
          setShowForm(true);
          setEditingBlog(blog);
        }}
        onDelete={handleDeleteBlog}
        isLoader={isLoader}
      />

      {/* Create/Edit Blog Form */}
      {showForm && (
        <div className="mt-8">
          <BlogForm
            defaultValues={editingBlog || {}}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}

      {/* Button to show create blog form */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBlog(null); // Reset form to create new blog
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
        >
          Create New Blog
        </button>
      )}
    </div>
  );
};

export default Blog;
