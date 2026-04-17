import { trendingGames } from "@/mocks/homeMock";



export const productService = {
  async getProducts() {
    return trendingGames;
  },
};