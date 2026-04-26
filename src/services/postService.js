import axiosInstance from "../utils/axiosInstance";
import { mockPosts, mockCommentsByPostId } from "../mocks/postMock";

const USE_MOCK = true;
const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || fallbackMessage;
};

// Lấy danh sách bài viết với phân trang
export const getPosts = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const res = await axiosInstance.get("/Post", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bài viết"),
    );
  }
};

export const getLatestPosts = async () => {
  try {
    if (USE_MOCK) {
      await wait();

      return {
        data: mockPosts,
      };
    }

    const res = await axiosInstance.get("/Post/latest");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không lấy được bài viết mới nhất"));
  }
};

// Lấy thông tin chi tiết của một bài viết
export const getPostById = async (postId) => {
  try {
    if (!postId) {
      throw new Error("Thiếu postId để lấy thông tin bài viết");
    }

    const res = await axiosInstance.get(`/Post/${postId}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không lấy được bài viết"));
  }
};

// Lấy danh sách bài viết của người dùng hiện tại
export const getMyPosts = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const res = await axiosInstance.get("/Post/user/me", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bài viết"),
    );
  }
};

// Tạo bài viết mới
export const createPost = async (payload) => {
  try {
    if (!payload) {
      throw new Error("Dữ liệu bài viết không hợp lệ");
    }

    const formData = new FormData();

    if (payload?.title) {
      formData.append("Title", payload.title);
    }

    if (payload?.content) {
      formData.append("Content", payload.content);
    }

    if (payload?.images?.length) {
      payload.images.forEach((file) => {
        console.log("Appending file to formData:", file.name);
        formData.append("MediaFiles", file);
      });
    }

    const res = await axiosInstance.post("/Post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Tạo bài viết thất bại"));
  }
};

// Cập nhật bài viết
export const updatePost = async (postId, payload) => {
  try {
    if (!postId) {
      throw new Error("Thiếu postId để cập nhật bài viết");
    }

    if (!payload) {
      throw new Error("Dữ liệu bài viết không hợp lệ");
    }

    console.log("Updating post with payload:", payload);
    const res = await axiosInstance.put(`/Post/${postId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Cập nhật bài viết thất bại"));
  }
};

// Xóa bài viết
export const deletePost = async (postId) => {
  try {
    if (!postId) {
      throw new Error("Thiếu postId để xóa bài viết");
    }

    const res = await axiosInstance.delete(`/Post/${postId}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Xóa bài viết thất bại"));
  }
};

// Lấy bình luận của một bài viết với phân trang
export const getPostComments = async ({ postId, page = 1, limit = 5 }) => {
  try {
    if (!postId) {
      throw new Error("Thiếu postId để lấy bình luận");
    }

    if (USE_MOCK) {
      await wait();

      const allComments = mockCommentsByPostId[postId] || [];
      const start = (page - 1) * limit;
      const end = start + limit;
      const comments = allComments.slice(start, end);

      return {
        data: comments,
        pagination: {
          page,
          limit,
          total: allComments.length,
          hasNextPage: end < allComments.length,
        },
      };
    }

    const res = await axiosInstance.get(`/Post/${postId}/comments`, {
      params: { page, limit },
    });

    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bình luận"),
    );
  }
};

// Tạo bình luận cho một bài viết
export const createComment = async (payload) => {
  try {
    if (!payload) {
      throw new Error("Dữ liệu bình luận không hợp lệ");
    }

    if (USE_MOCK) {
      await wait();

      const newComment = {
        id: Date.now(),
        name: payload?.displayName || payload?.name || "John Doe",
        username: payload?.username
          ? payload.username.startsWith("@")
            ? payload.username
            : `@${payload.username}`
          : "@johndoe",
        avatar:
          payload?.avatar ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        time: "Vừa xong",
        content: payload?.content || "",
        editable: true,
      };

      return {
        message: "Tạo bình luận thành cong",
        data: newComment,
      };
    }

    const res = await axiosInstance.post(`/Post/${payload.postId}/comments`, {
      content: payload.content,
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Tạo bình luận thất bại"));
  }
};
