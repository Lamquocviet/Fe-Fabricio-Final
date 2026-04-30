import axiosInstance from "../utils/axiosInstance";
import {
  gameLibrary,
  mockFeaturedGames,
  trendingGames,
} from "../mocks/homeMock";

const USE_MOCK = true;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || fallbackMessage;
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
      return res.data.game;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Không lấy được thông tin game"));
    }
  },

  async getGameFavorites(userId) {
    try {
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
      const res = await axiosInstance.post("/GameFavorites", { gameId });
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Thêm vào yêu thích thất bại"));
    }
  },
  async removeGameFavorite(gameId) {
    try {
      const res = await axiosInstance.delete(`/GameFavorites/${gameId}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Xóa khỏi yêu thích thất bại"));
    }
  },
};


export const uploadGame = async (payload) => {
  try {
    console.log("=== UPLOADING GAME ===");
    console.log("Payload:", payload);
    console.log("TagIds:", payload.TagIds);
    console.log("TagIds length:", payload.TagIds?.length);

    const formData = new FormData();

    formData.append("Title", payload.Title);
    formData.append("Description", payload.Description);
    formData.append("Thumbnail", payload.Thumbnail);
    formData.append("GameType", payload.GameType);
    formData.append("GameFile", payload.GameFile);
    formData.append("Price", payload.Price);

    console.log("Adding TagIds to FormData:");
    payload.TagIds?.forEach((tagId, index) => {
      console.log(`  TagIds[${index}]:`, tagId);
      formData.append("TagIds", tagId);
    });

    const res = await axiosInstance.post("/Games", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("API Response:", res.data);
    console.log("Response gameTags:", res.data?.gameTags);

    return res.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(getErrorMessage(error, "Failed to upload game"));
  }
};

// GET COMMENTS
export const getGameComments = async (
  gameId,
  { page = 1, limit = 10 } = {}
) => {
  try {
    const res = await axiosInstance.get(
      `/games/${gameId}/comment`,   
    );
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Không lấy được danh sách bình luận")
    );
  }
};

// POST COMMENT
export const createGameComment = async (gameId, content) => {
  try {
    const res = await axiosInstance.post(
      `/games/${gameId}/comment`,   
      { content }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Tạo bình luận thất bại")
    );
  }
};
// GAME RATINGS
export const getGameRatings = async (gameId) => {
  try {
    if (!gameId) throw new Error("gameId is required");

    const res = await axiosInstance.get(`/games/${gameId}/ratings`);

    return res.data; // { total, average }
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không lấy được rating"));
  }
};

export const putGameRatings = async (gameId, value) => {
  try {
    if (!gameId) throw new Error("gameId is required");
    if (!value) throw new Error("rating value is required");

    const res = await axiosInstance.put(
      `/games/${gameId}/ratings`,
      { value } 
    );

    return res.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Đánh giá thất bại")
    );
  }
};

// GAME PURCHASES
export const purchaseGame = (gameId, amount) => {
  return axiosInstance.post(`/games/${gameId}/purchase`, {
    amound: amount, // backend đang typo "amound"
  });
};

export const getPlayUrl = (gameId) => {
  return axiosInstance.get(`/Games/${gameId}/play`);
};

export const getDownloadUrl = (gameId) => {
  return axiosInstance.get(`/Games/${gameId}/download`);
};
export const getUserGamePurchases = async (userId) => {
  try {
    if (!userId) throw new Error("userId is required");

    const res = await axiosInstance.get(`/GamePurchases/user/${userId}`);

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Không lấy được lịch sử mua game"));
  }
};
