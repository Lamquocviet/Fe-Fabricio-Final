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
  async getGameLibrary() {
    return gameLibrary;
  },
  async getGameById(id) {
    return gameLibrary.find((game) => game.id === id) || null;
  },
};

export const uploadGame = async (payload) => {
  try {

    console.log("Uploading game with payload:", payload);
    const formData = new FormData();

    formData.append("Title", payload.Title);
    formData.append("Description", payload.Description);
    formData.append("Thumbnail", payload.Thumbnail);
    formData.append("GameType", payload.GameType);
    formData.append("GameFile", payload.GameFile);
    formData.append("Price", payload.Price);

    payload.TagIds.forEach((tagId) => {
      formData.append("TagIds", tagId);
    });

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
