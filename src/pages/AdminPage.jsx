import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Gamepad2,
  FileText,
  LayoutDashboard,
  Search,
  Trash2,
  Ban,
  Unlock,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { adminService } from "@/services/adminService";
import useRequireAuth from "@/hooks/useRequireAuth";

/* ─────────────── Sub-components ─────────────── */

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  </div>
);

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Xác nhận", type = "danger" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[28px] p-8 shadow-2xl animate-in zoom-in duration-200">
        <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 leading-relaxed mb-8">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-colors">
            Hủy
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${type === 'danger' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Main Admin Page ─────────────── */

export default function AdminPage() {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useRequireAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailTab, setDetailTab] = useState("info");
  const [userContent, setUserContent] = useState({ games: [], posts: [], loading: false });

  // Confirmation state
  const [confirmData, setConfirmData] = useState({ isOpen: false, action: null, title: "", message: "" });

  // Role Protection
  useEffect(() => {
    const isAdmin = 
      currentUser?.role?.toLowerCase() === "admin" || 
      currentUser?.Role?.toLowerCase() === "admin" || 
      currentUser?.role === 1 || 
      currentUser?.Role === 1 ||
      currentUser?.role === "1" ||
      currentUser?.Role === "1";

    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
      toast.error("Bạn không có quyền truy cập trang Admin");
    }
  }, [currentUser, isAuthenticated, loading, navigate]);

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalGames: games.length,
      totalPosts: posts.length,
      activeUsers: users.filter(u => !u.isBanned).length,
    };
  }, [users, games, posts]);

  // Fetch data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, gamesRes, postsRes] = await Promise.allSettled([
        adminService.getAllUsers(),
        adminService.getAllGames(),
        adminService.getAllPosts(1, 1000)
      ]);
      
      if (usersRes.status === "fulfilled") setUsers(usersRes.value || []);
      
      if (gamesRes.status === "fulfilled") {
        const gData = gamesRes.value;
        // Linh hoạt xử lý nếu backend trả về { games: [...] } hoặc trực tiếp mảng [...]
        const gamesList = gData?.games || gData?.Games || (Array.isArray(gData) ? gData : []);
        setGames(gamesList);
      }
      
      if (postsRes.status === "fulfilled") {
        const pData = postsRes.value;
        const postsList = pData?.items || pData?.Items || (Array.isArray(pData) ? pData : []);
        setPosts(postsList);
      }
    } catch (err) {
      toast.error("Lỗi hệ thống khi tải dữ liệu admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch User Content for Modal
  useEffect(() => {
    if (selectedUser && detailTab !== "info") {
      const fetchUserContent = async () => {
        setUserContent(prev => ({ ...prev, loading: true }));
        try {
          const userId = selectedUser.id || selectedUser.Id;
          const [gamesRes, postsRes] = await Promise.allSettled([
            adminService.getAllGames(),
            adminService.getAllPosts(1, 1000)
          ]);
          
          let userGames = [];
          if (gamesRes.status === "fulfilled") {
            const gData = gamesRes.value;
            const allGames = gData?.games || gData?.Games || (Array.isArray(gData) ? gData : []);
            userGames = allGames.filter(g => (g.userId || g.UserId) === userId);
          }

          let userPosts = [];
          if (postsRes.status === "fulfilled") {
            const pData = postsRes.value;
            const allPosts = pData?.items || pData?.Items || (Array.isArray(pData) ? pData : []);
            userPosts = allPosts.filter(p => (p.authorId || p.AuthorId) === userId);
          }

          setUserContent({ games: userGames, posts: userPosts, loading: false });
        } catch (err) {
          setUserContent(prev => ({ ...prev, loading: false }));
        }
      };
      fetchUserContent();
    }
  }, [selectedUser, detailTab]);

  /* ────────── Actions ────────── */
  const triggerConfirm = (action, title, message, type = "danger") => {
    setConfirmData({ isOpen: true, action, title, message, type });
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      await adminService.banGameUpload(userId);
      toast.success(isBanned ? "Đã mở khóa tài khoản" : "Đã cấm đăng game thành công");
      loadAllData();
    } catch (err) {
      toast.error("Thao tác thất bại");
    } finally {
      setConfirmData(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      await adminService.deleteGame(gameId);
      toast.success("Đã xóa game vĩnh viễn");
      setGames(prev => prev.filter(g => g.id !== gameId));
    } catch (err) {
      toast.error("Xóa game thất bại");
    } finally {
      setConfirmData(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await adminService.deletePost(postId);
      toast.success("Đã xóa bài viết");
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      toast.error("Xóa bài viết thất bại");
    } finally {
      setConfirmData(prev => ({ ...prev, isOpen: false }));
    }
  };

  /* ────────── Render Views ────────── */

  const renderDashboard = () => {
    const chartData = posts.slice(0, 10).map((p, i) => ({
      name: new Date(p.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      posts: Math.floor(Math.random() * 20) + 5,
      users: Math.floor(Math.random() * 10) + 2,
    })).reverse();

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Người dùng" value={stats.totalUsers} icon={Users} color="bg-blue-500" trend="+12%" />
          <StatCard title="Tổng Game" value={stats.totalGames} icon={Gamepad2} color="bg-violet-500" trend="+5%" />
          <StatCard title="Bài viết" value={stats.totalPosts} icon={FileText} color="bg-emerald-500" trend="+18%" />
          <StatCard title="Đang hoạt động" value={stats.activeUsers} icon={CheckCircle2} color="bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-[32px] p-8">
            <h3 className="text-xl font-bold text-white mb-8">Thống kê hoạt động hệ thống</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorPosts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] p-8">
            <h3 className="text-xl font-bold text-white mb-8">Báo cáo mới nhất</h3>
            <div className="space-y-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-5 p-4 rounded-[24px] bg-white/5 hover:bg-white/10 transition-all border border-white/0 hover:border-white/5 group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-bold">Nội dung không phù hợp</p>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">Bài viết bị báo cáo bởi cộng đồng.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const filtered = users.filter(u => 
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
            placeholder="Tìm kiếm theo tên, username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-8 py-5">Người dùng</th>
                <th className="px-8 py-5">Phân quyền</th>
                <th className="px-8 py-5">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(user => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} className="w-12 h-12 rounded-[18px] object-cover border-2 border-white/10 group-hover:border-violet-500/50 transition-colors" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 ${user.isGameBanned ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{user.displayName}</p>
                        <p className="text-xs text-zinc-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${user.role === 'Admin' || user.role === '1' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {user.role === 'Admin' || user.role === '1' ? 'Admin' : 'Member'}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {user.isGameBanned ? (
                      <span className="inline-flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <Ban className="w-3.5 h-3.5" /> Bị cấm đăng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => triggerConfirm(
                          () => handleBanUser(user.id, user.isGameBanned),
                          user.isGameBanned ? "Gỡ cấm người dùng?" : "Xác nhận cấm đăng game?",
                          `Xác nhận thay đổi quyền đăng game cho @${user.username}?`,
                          user.isGameBanned ? 'info' : 'danger'
                        )}
                        className={`p-3 rounded-2xl transition-all hover:scale-110 shadow-lg ${user.isGameBanned ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}
                      >
                        {user.isGameBanned ? <Unlock className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(user); setDetailTab("info"); }}
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all hover:scale-110"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGames = () => {
    const filtered = games.filter(g => g.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            placeholder="Tìm kiếm game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-8 py-5">Trò chơi</th>
                <th className="px-8 py-5">Giá</th>
                <th className="px-8 py-5">Mã định danh</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(game => (
                <tr key={game.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={game.thumbnailUrl} className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform" />
                      <div>
                        <p className="font-bold text-white text-base">{game.title}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium">FabricIO Store</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-emerald-400 font-black text-base">
                      {game.price > 0 ? `$${game.price}` : 'FREE'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <code className="text-[10px] text-zinc-500 bg-white/5 px-2 py-1 rounded">
                      {game.id}
                    </code>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/games/${game.id}`)}
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => triggerConfirm(
                          () => handleDeleteGame(game.id),
                          "Xóa game vĩnh viễn?",
                          `Game "${game.title}" sẽ bị gỡ bỏ hoàn toàn khỏi hệ thống.`
                        )}
                        className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPosts = () => {
    const filtered = posts.filter(p => 
      p.author?.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none transition-all"
            placeholder="Tìm theo người đăng hoặc tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-8 py-5">Bài viết</th>
                <th className="px-8 py-5">Người đăng</th>
                <th className="px-8 py-5">Ngày tạo</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(post => (
                <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                        <FileText className="w-5 h-5 text-violet-400" />
                      </div>
                      <p className="font-bold text-white text-base truncate max-w-xs">{post.title}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-300 font-medium">{post.author?.displayName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-zinc-500">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/posts`)}
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => triggerConfirm(
                          () => handleDeletePost(post.id),
                          "Xóa bài viết này?",
                          "Bài viết này sẽ bị xóa vĩnh viễn khỏi cộng đồng."
                        )}
                        className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(139,92,246,0.2)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-[1500px] mx-auto">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent tracking-tight">
                  Quản trị hệ thống
                </h1>
                <p className="text-zinc-500 mt-3 text-lg font-medium">Bảng điều khiển trung tâm FabricIO.</p>
              </div>
              
              <div className="flex bg-zinc-900/50 p-2 rounded-[24px] border border-white/5 backdrop-blur-xl shadow-2xl">
                {[
                  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
                  { id: "users", label: "Tài khoản", icon: Users },
                  { id: "games", label: "Game", icon: Gamepad2 },
                  { id: "posts", label: "Post", icon: FileText },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                    className={`flex items-center gap-3 px-8 py-3.5 rounded-[20px] text-sm font-black transition-all ${
                      activeTab === tab.id 
                        ? "bg-violet-600 text-white shadow-[0_10px_25px_rgba(124,58,237,0.3)] scale-105" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </header>

            <div className="min-h-[600px]">
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "users" && renderUsers()}
              {activeTab === "games" && renderGames()}
              {activeTab === "posts" && renderPosts()}
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal 
        {...confirmData} 
        onCancel={() => setConfirmData(prev => ({ ...prev, isOpen: false }))} 
        onConfirm={confirmData.action}
      />

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative">
            {/* Header Profile - Fixed part */}
            <div className="shrink-0">
              <div className="h-40 bg-gradient-to-br from-violet-900/40 via-zinc-900 to-zinc-950 relative border-b border-white/5">
                <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all hover:scale-110 z-20">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="px-10 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 -mt-16 items-end">
                  <div className="relative shrink-0">
                    <img 
                      src={selectedUser.avatarUrl || `https://ui-avatars.com/api/?name=${selectedUser.username}`} 
                      className="w-32 h-32 rounded-[32px] object-cover border-8 border-zinc-950 shadow-2xl" 
                    />
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl border-4 border-zinc-950 ${selectedUser.isGameBanned ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  </div>
                  <div className="pb-2 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-3xl font-black text-white">{selectedUser.displayName}</h3>
                        <p className="text-zinc-500 font-medium text-lg">@{selectedUser.username}</p>
                      </div>
                      <button 
                        onClick={() => handleBanUser(selectedUser.id, selectedUser.isGameBanned)}
                        className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                          selectedUser.isGameBanned ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/10' : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/10'
                        }`}
                      >
                        {selectedUser.isGameBanned ? "Gỡ cấm đăng" : "Cấm đăng game"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content area - Scrollable part */}
            <div className="px-10 pb-10 flex-1 overflow-y-auto custom-scrollbar mt-8">
              <div className="mt-4">
                <div className="flex border-b border-white/5 gap-8 mb-8">
                  {["info", "games", "posts"].map(t => (
                    <button 
                      key={t}
                      onClick={() => setDetailTab(t)}
                      className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                        detailTab === t ? "text-white" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      {t === 'info' ? 'Thông tin' : t === 'games' ? 'Sản phẩm' : 'Bài viết'}
                      {detailTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 rounded-full" />}
                    </button>
                  ))}
                </div>

                <div className="pb-10">
                  {detailTab === "info" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white/3 rounded-3xl p-6 border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Email</p>
                        <p className="text-white text-lg font-medium">{selectedUser.email}</p>
                      </div>
                      <div className="bg-white/3 rounded-3xl p-6 border border-white/5 md:col-span-2">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Tiểu sử (Bio)</p>
                        <p className="text-white leading-relaxed">{selectedUser.bio || "Chưa cập nhật tiểu sử."}</p>
                      </div>
                    </div>
                  )}

                  {detailTab === "games" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                      {userContent.loading ? (
                        <p className="text-zinc-500 italic">Đang tải...</p>
                      ) : userContent.games.length > 0 ? (
                        userContent.games.map(g => (
                          <div key={g.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-2xl border border-white/5">
                            <img src={g.thumbnailUrl} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold truncate">{g.title}</p>
                              <p className="text-xs text-emerald-400 font-bold">{g.price > 0 ? `$${g.price}` : 'FREE'}</p>
                            </div>
                            <button onClick={() => navigate(`/games/${g.id}`)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400"><Eye className="w-4 h-4" /></button>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-500 italic text-center py-10">Chưa có game nào.</p>
                      )}
                    </div>
                  )}

                  {detailTab === "posts" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                      {userContent.loading ? (
                        <p className="text-zinc-500 italic">Đang tải...</p>
                      ) : userContent.posts.length > 0 ? (
                        userContent.posts.map(p => (
                          <div key={p.id} className="p-5 bg-white/3 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                             <p className="text-white font-bold truncate">{p.title}</p>
                             <button onClick={() => handleDeletePost(p.id)} className="text-zinc-500 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-500 italic text-center py-10">Chưa có bài viết nào.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="w-full mt-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
}
