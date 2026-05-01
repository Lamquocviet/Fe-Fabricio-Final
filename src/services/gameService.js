/* eslint-disable no-unused-vars */
import axiosInstance from "../utils/axiosInstance";
import { assertAuthenticated } from "@/utils/authGuard";
import {
  gameLibrary,
  mockFeaturedDrop,
  mockFeaturedGames,
  trendingGames,
} from "../mocks/homeMock";

const USE_MOCK = true;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

export const getGameList = async () => {
  try {
    const res = await axiosInstance.get("/Games");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch game list"));
  }
};

export const getFeaturedGames = async () => {
  try {
    const res = await axiosInstance.get("/Games/featuredGame");
    return res.data;
  } catch (error) {
    if (USE_MOCK) {
      await wait(500);
      return {
        data: mockFeaturedDrop,
      };
    }
    throw new Error(getErrorMessage(error, "Failed to fetch featured games"));
  }
};

export const getTopRatedGames = async () => {
  try {
    const res = await axiosInstance.get("/Games/topRatingGames");
    if (res.data?.length === 0 && USE_MOCK) {
      await wait(500);
      return {
        data: mockFeaturedGames,
      };
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch top-rated games"));
  }
};

export const gameLibraryService = {
  async getGameLibrary({ page = 1, limit = 12, search = "" } = {}) {
    // console.log("CALL getGameLibrary");

    try {
      const params = { page, limit };

      if (search?.trim()) {
        params.search = search;
      }

      const res = await axiosInstance.get("/Games", { params });

      // console.log("API response:", res.data);

      return res.data;
    } catch (error) {
      console.error("API ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);
      }

      throw error;
    }
  },
  async getGameById(id) {
    try {
      const res = await axiosInstance.get(`/Games/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Không lấy được thông tin game"));
    }
  },
  async getGameDetails(id) {
    try {
      const res = await axiosInstance.get(`/Games/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Không lấy được chi tiết game"));
    }
  },
  async getGameFavorites(userId) {
    try {
      assertAuthenticated();

      const res = await axiosInstance.get(`/GameFavorites/user/${userId}`);
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Không lấy được danh sách yêu thích"),
      );
    }
  },
  async addGameFavorite(gameId) {
    try {
      assertAuthenticated();

      const res = await axiosInstance.post("/GameFavorites", { gameId });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Thêm vào yêu thích thất bại"));
    }
  },
  async removeGameFavorite(gameId) {
    try {
      assertAuthenticated();

      const res = await axiosInstance.delete(`/GameFavorites/${gameId}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Xóa khỏi yêu thích thất bại"));
    }
  },
};
export const uploadGame = async (payload) => {
  try {
    assertAuthenticated();

    console.log("Uploading game with payload:", payload);

    const formData = new FormData();

    formData.append("Title", payload.Title ?? "");
    formData.append("Description", payload.Description ?? "");
    formData.append("Thumbnail", payload.Thumbnail);
    formData.append("GameType", payload.GameType);
    formData.append("GameFile", payload.GameFile);
    formData.append("Price", payload.Price ?? 0);

    if (Array.isArray(payload.TagIds)) {
      payload.TagIds.forEach((tagId) => {
        formData.append("TagIds", tagId);
      });
    }

    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await axiosInstance.post("/Games", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to upload game"));
  }
};

// GAME COMMENTS

export const getGameComments = async (
  gameId,
  { page = 1, limit = 10 } = {},
) => {
  try {
    if (!gameId) throw new Error("gameId is required");

    const res = await axiosInstance.get(`/games/${gameId}/comment`, {
      params: { page, limit },
    });

    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bình luận"),
    );
  }
};

export const createGameComment = async (gameId, content) => {
  try {
    assertAuthenticated();

    if (!gameId) throw new Error("gameId is required");
    if (!content?.trim()) throw new Error("content is required");

    const res = await axiosInstance.post(`/games/${gameId}/comment`, {
      content: content.trim(),
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Tạo bình luận thất bại"));
  }
};

// GAME RATINGS
export const getGameRatings = async (gameId, { page = 1, limit = 10 } = {}) => {
  try {
    if (!gameId) throw new Error("gameId is required");

    const res = await axiosInstance.get(`/games/${gameId}/ratings`, {
      params: { page, limit },
    });

    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách đánh giá"),
    );
  }
};

export const rateGame = async (gameId, rating) => {
  try {
    assertAuthenticated();

    if (!gameId) throw new Error("gameId is required");
    if (rating < 1 || rating > 5) {
      throw new Error("rating must be between 1 and 5");
    }

    const res = await axiosInstance.put(`/games/${gameId}/ratings`, {
      stars: rating,
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Đánh giá game thất bại"));
  }
};

// GAME PURCHASES
export const purchaseGame = async (gameId, amount = 0) => {
  try {
    assertAuthenticated();

    if (!gameId) throw new Error("gameId is required");

    const res = await axiosInstance.post(`/games/${gameId}/purchase`, {
      amountPaid: amount
    });

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Mua game thất bại"));
  }
};

export const getUserGamePurchases = async (userId) => {
  try {
    assertAuthenticated();

    if (!userId) throw new Error("userId is required");

    const res = await axiosInstance.get(`/GamePurchases/user/${userId}`);

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không lấy được lịch sử mua game"));
  }
};
