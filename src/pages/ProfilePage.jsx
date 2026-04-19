import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <div className="flex me-4">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1">
          <div className="space-y-8">
            <h1>Profile</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
