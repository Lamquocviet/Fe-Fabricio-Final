import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useHomeFeed from "../hooks/useHomeFeed";
import FilterBar from "../components/FilterBar";
import { useProducts } from "@/hooks/useLibraryGame";
import TaskPagination from "@/components/TaskPagination";
import GameLibrarySection from "@/sections/GameLibrarySection";
import { RotateCcw } from "lucide-react";

export default function GamePage() {
  const { loading, error } = useHomeFeed();

  const { filters, setFilters, filteredProducts, resetFilters } = useProducts();
  const [page, setPage] = useState(1);

  const pageSize = 12;

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const currentProducts = filteredProducts.slice(start, end);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => prev - 1);
  const handlePageChange = (p) => setPage(p);

  if (loading) {
    return (
      <div className="space-y-6 bg-[#050505] px-4 py-6 text-white lg:px-6">
        <div className="h-90 animate-pulse rounded-[30px] bg-white/5" />
        <div className="h-105 animate-pulse rounded-[30px] bg-white/5" />
        <div className="h-80 animate-pulse rounded-[30px] bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#050505] px-4 py-6 text-white lg:px-6">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          Failed to load home feed: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 lg:px-6">
          <div className="min-h-screen bg-[#050505] text-white p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <FilterBar filters={filters} setFilters={setFilters} />

              {filters && (
                <button
                  onClick={resetFilters}
                  className="group flex items-center gap-2 px-4 py-2.5 
                   bg-zinc-900/50 hover:bg-red-500/10 
                   border border-zinc-800 hover:border-red-500/50 
                   rounded-xl transition-all duration-300 ease-out"
                >
                  <RotateCcw
                    size={16}
                    strokeWidth={2.5}
                    className="text-zinc-500 group-hover:text-red-400 group-hover:rotate-[-180deg] transition-all duration-500"
                  />

                  <span className="text-sm font-medium text-zinc-400 group-hover:text-red-400">
                    Reset Filters
                  </span>
                </button>
              )}
            </div>

            {/* Phần hiển thị danh sách Game */}
            <div className="mt-6 space-y-2">
              <GameLibrarySection games={currentProducts} />
            </div>
          </div>
          <TaskPagination
            handleNext={handleNext}
            handlePrev={handlePrev}
            handlePageChange={handlePageChange}
            page={page}
            totalPages={totalPages}
          />
        </main>
      </div>
    </div>
  );
}
