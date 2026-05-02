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

export const rateGame = async (gameId, rating) => {
  try {
    if (!gameId) throw new Error("gameId is required");
    if (rating < 1 || rating > 5) {
      throw new Error("rating must be between 1 and 5");
    }

    const res = await axiosInstance.put(`/games/${gameId}/ratings`, {
      stars: rating,
    });

    return res.data;
  } catch (error) {
    throw new Error("Đánh giá game thất bại");
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

export const userService = {
  async getMe() {
    try {
    const res = await axiosInstance.get("/Users/me");
    return res.data;
  
    } catch (error) {
      console.error("getMe error:", error);
      throw error;
    }
  },
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
  

}};



export const uploadGame = async (payload) => {
  try {

    assertAuthenticated();

    const formData = new FormData();

    formData.append("Title", payload.Title ?? "");
    formData.append("Description", payload.Description ?? "");
    formData.append("Thumbnail", payload.Thumbnail);
    formData.append("GameType", payload.GameType);
    formData.append("GameFile", payload.GameFile);
    formData.append("Price", payload.Price ?? 0);


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


    return res.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(getErrorMessage(error, "Failed to upload game"));
  }
};

// GET COMMENTS
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

// POST COMMENT
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



export const purchaseGame = async (gameId, amount) => {
  const res = await axiosInstance.post(`/games/${gameId}/purchase`, {
    amound: amount, // nếu backend đang dùng typo này thì giữ
  });
  return res.data;
};


export const getPurchaseHistory = async () => {
  const res = await axiosInstance.get(`/Users/gamepaid`);
  return res.data;
};


export const getPlayUrl = async (gameId) => {
  const res = await axiosInstance.get(`/Games/${gameId}/play`);
  return res.data;
};

export const getDownloadUrl = async (gameId) => {
  const res = await axiosInstance.get(`/Games/${gameId}/download`);
  return res.data;
};
