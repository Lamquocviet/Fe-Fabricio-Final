import axiosInstance from "../utils/axiosInstance";
import { mockPosts, mockCommentsByPostId } from "../mocks/postMock";

const USE_MOCK = true;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getLatestPosts = async () => {
  if (USE_MOCK) {
    await wait(500);
    return {
      data: mockPosts,
    };
  }

  // const res = await axiosInstance.get("/posts/latest");
  // return res.data;
};

export const getPostComments = async ({ postId, page = 1, limit = 5 }) => {
  if (USE_MOCK) {
    await wait(500);

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
};
