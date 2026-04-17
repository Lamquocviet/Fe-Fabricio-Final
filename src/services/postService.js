import axiosInstance from "../utils/axiosInstance";
import { mockPosts, mockCommentsByPostId } from "../mocks/postMock";

const USE_MOCK = true;
const wait = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || fallbackMessage;
};

export const getPosts = async ({ page = 1, limit = 10 } = {}) => {
  try {
    if (USE_MOCK) {
      await wait();

      const start = (page - 1) * limit;
      const end = start + limit;
      const posts = mockPosts.slice(start, end);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          total: mockPosts.length,
          hasNextPage: end < mockPosts.length,
        },
      };
    }

    const res = await axiosInstance.get("/posts", {
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

    const res = await axiosInstance.get("/posts/latest");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không lấy được bài viết mới nhất"));
  }
};

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

    const res = await axiosInstance.get(`/posts/${postId}/comments`, {
      params: { page, limit },
    });

    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bình luận"),
    );
  }
};

export const createPost = async (payload) => {
  try {
    if (!payload) {
      throw new Error("Dữ liệu bài viết không hợp lệ");
    }

    if (USE_MOCK) {
      await wait();

      const newPost = {
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
        role: payload?.role || "player",
        content: payload?.content || "",
        media:
          payload?.images?.map((file) =>
            typeof file === "string" ? file : URL.createObjectURL(file),
          ) || [],
        stats: {
          likes: 0,
          comments: 0,
        },
        editable: true,
      };

      return {
        message: "Tạo bài viết thành công",
        data: newPost,
      };
    }

    const formData = new FormData();

    if (payload?.content) {
      formData.append("content", payload.content);
    }

    if (payload?.userId) {
      formData.append("userId", payload.userId);
    }

    if (payload?.role) {
      formData.append("role", payload.role);
    }

    if (payload?.images?.length) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await axiosInstance.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Tạo bài viết thất bại"));
  }
};

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

    const res = await axiosInstance.post(`/posts/${payload.postId}/comments`, {
      content: payload.content,
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Tạo bình luận thất bại"));
  }
};

export const deletePost = async (postId) => {
  return axiosInstance
    .delete(`/posts/${postId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw new Error(getErrorMessage(error, "Xóa bài viết thất bại"));
    });
};
