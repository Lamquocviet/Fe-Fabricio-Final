import React from 'react';
import { Heart, MessageSquare, Star } from 'lucide-react';

const FeedbackNotifications = () => {
  const notifications = [
    { id: 1, type: 'comment', user: 'Alex', action: 'đã bình luận về', target: 'Cyber City 2077', time: '2 phút trước', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, type: 'like', user: 'Maria', action: 'thả tim bài viết của bạn', target: 'Bản cập nhật v2.0', time: '15 phút trước', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, type: 'review', user: 'JohnDoe', action: 'đã đánh giá 5 sao cho', target: 'Fantasy Quest', time: '1 giờ trước', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, type: 'comment', user: 'Sarah', action: 'đã trả lời bình luận của bạn', target: '', time: '3 giờ trước', avatar: 'https://i.pravatar.cc/150?u=4' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'like': return <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />;
      case 'review': return <Star className="w-4 h-4 text-amber-400" fill="currentColor" />;
      default: return null;
    }
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Thông báo tương tác</h3>
        <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Xem tất cả</button>
      </div>
      
      <div className="space-y-4">
        {notifications.map(notif => (
          <div key={notif.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="relative">
              <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-zinc-900 p-1 rounded-full border border-zinc-800">
                {getIcon(notif.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 line-clamp-2">
                <span className="font-semibold text-white">{notif.user}</span> {notif.action} <span className="font-semibold text-white">{notif.target}</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackNotifications;
