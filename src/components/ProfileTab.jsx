import { useState } from 'react';


export default function ProfileTab({ game }) {
  const [activeTab, setActiveTab] = useState('Games');

  const tabs = [
    { id: 'Games', label: 'Games' },
    { id: 'Posts', label: 'Posts' },
    { id: 'My games', label: 'My games' },
  ];

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
        {activeTab === 'Games' && <h1>Games</h1>}
        {activeTab === 'Posts' && <h1>Posts</h1>}
        {activeTab === 'My games' && <h1>My games</h1>}
      </div>
    </div>
  );
}