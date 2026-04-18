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
export const gameLibraryService = {
  async getGameLibrary() {
    return gameLibrary;
  },
  async getGameById(id) {
    return gameLibrary.find(game => game.id === id) || null;
  }
};
