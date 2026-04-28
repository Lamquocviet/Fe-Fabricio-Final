import axiosInstance from "../utils/axiosInstance";
import { gameLibrary, mockFeaturedGames, trendingGames } from "../mocks/homeMock";

const USE_MOCK = true;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFeaturedGames = async () => {
  if (USE_MOCK) {
    await wait(500);
    return {
      data: mockFeaturedGames,
    };
  }

  const res = await axiosInstance.get("/games/featured");
  return res.data;
};

export const getTrendingGames = async () => {
  if (USE_MOCK) {
    await wait(500);
    return {
      data: trendingGames,
    };
  }

  const res = await axiosInstance.get("/games/trending");
  return res.data;
};

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || fallbackMessage;
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
      throw new Error(
        getErrorMessage(error, "Không lấy được thông tin game")
      );
    }
  },
  async getGameDetails(id) {
    try {
      const res = await axiosInstance.get(`/Games/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Không lấy được chi tiết game")
      );
    }
  },
  async getGameFavorites(userId) {
    try {
      const res = await axiosInstance.get(`/GameFavorites/user/${userId}`);
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Không lấy được danh sách yêu thích")
      );
    }
  },
  async addGameFavorite(gameId) {
    try {
      const res = await axiosInstance.post("/GameFavorites", { gameId });
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Thêm vào yêu thích thất bại")
      );
    }
  },
  async removeGameFavorite(gameId) {
    try {
      const res = await axiosInstance.delete(`/GameFavorites/${gameId}`);
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Xóa khỏi yêu thích thất bại")
      );
    }
  }
};



export const uploadGame = async (data) => {
  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "images") {
        data.images.forEach((img) => formData.append("images", img));
      } else if (key === "tags") {
        data.tags.forEach((tag) => formData.append("tags", tag));
      } else if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    const res = await axiosInstance.post("/Games", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Tải game thất bại");
  }
};

export const getGameComments = async (gameId, { page = 1, limit = 10 } = {}) => {
  try {
    const res = await axiosInstance.get(`/GameComments/${gameId}`, {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bình luận")
    );
  }
};

export const createGameComment = async (gameId, content) => {
  try {
    const res = await axiosInstance.post("/GameComments", {
      gameId,
      content,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Tạo bình luận thất bại")
    );
  }
};

export const getGameRatings = async (gameId, { page = 1, limit = 10 } = {}) => {
  try {
    const res = await axiosInstance.get(`/GameRatings/${gameId}`, {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách đánh giá")
    );
  }
};

export const rateGame = async (gameId, rating) => {
  try {
    const res = await axiosInstance.post("/GameRatings", {
      gameId,
      rating,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Đánh giá game thất bại")
    );
  }
};

export const purchaseGame = async (gameId) => {
  try {
    const res = await axiosInstance.post("/GamePurchases", {
      gameId,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Mua game thất bại")
    );
  }
};

export const getUserGamePurchases = async (userId) => {
  try {
    const res = await axiosInstance.get(`/GamePurchases/user/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được lịch sử mua game")
    );
  }
};