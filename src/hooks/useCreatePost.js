import { useState } from "react";
import { createPost } from "../services/postService";

export default function useCreatePost(onCreated) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const handleChangeContent = (e) => {
    setContent(e.target.value);
    if (error) setError("");
    if (success) setSuccess("");
  };
  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files || []);

    setImages((prev) => {
      const merged = [...prev, ...files];

      return merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified,
          ),
      );
    });

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (user) => {
    const trimmedContent = content.trim();

    if (trimmedContent === "")
      return setError("Vui lòng nhập nội dung bài viết");

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("content", trimmedContent);
      formData.append("userId", user._id);
      images.forEach((file) => formData.append("images", file));

      const result = await createPost(formData);

      if (result?.error) return setError(result.error);

      setLoading(false);
      setSuccess("Tạo bài viết thành công");
      onCreated(result);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return {
    loading,
    success,
    error,
    content,
    images,
    handleChangeContent,
    handleSelectImages,
    handleRemoveImage,
    handleSubmit,
  };
}
