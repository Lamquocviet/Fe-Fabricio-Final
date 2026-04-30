import { useEffect, useState } from "react";
import MyGameTab from "./MyGameTab";
import { userService } from "@/services/userService";

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState("Games");
  const [user, setUser] = useState(null);

  const tabs = [
    { id: "Games", label: "Games" },
    { id: "Posts", label: "Posts" },
    { id: "My games", label: "My games" },
  ];

  // 🔥 fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error("GetMe error:", err);
      }
    };

    fetchUser();
  }, []);
  
  
  if (!user) {
    return <p className="text-white">Loading profile...</p>;
  }

  return (
    <div className="mt-16 max-w-7xl mx-auto px-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 text-lg font-medium transition-all relative
              ${activeTab === tab.id 
                ? 'text-white' 
                : 'text-zinc-400 hover:text-zinc-200'
              }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
        ))}
      </div>
      

      {/* Tab Content */}
       <div className="mt-8">

        {activeTab === "Games" && (
          <h1 className="text-white">All Games</h1>
        )}

        {activeTab === "Posts" && (
          <h1 className="text-white">Posts</h1>
        )}

        {activeTab === "My games" && (
          <MyGameTab userId={user.id} />
        )}

      </div>
    </div>
  );
}