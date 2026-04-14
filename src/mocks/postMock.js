export const mockPosts = [
  {
    id: "post-1",
    name: "Nova Vale",
    username: "@nova",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    time: "2h ago",
    role: "player",
    content:
      "Just cleared the final Neon Drift route on keyboard only. The speed lines and audio sync feel absurdly good.",
    media: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80",
    ],
    stats: {
      likes: 182,
      comments: 23,
    },
    editable: true,
  },
  {
    id: "post-2",
    name: "Pixel Forge Studio",
    username: "@pixelforge",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    time: "5h ago",
    role: "developer",
    content:
      "Ashfall Keep patch is live. We reworked stamina windows, improved boss readability, and added a foggy courtyard zone.",
    media: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80",
    ],
    stats: {
      likes: 312,
      comments: 54,
    },
    editable: false,
  },
];

export const mockCommentsByPostId = {
  "post-1": [
    {
      id: "c1",
      username: "nova",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      content: "Mock thread comments stay local to the UI.",
      createdAt: "2026-04-15T10:00:00Z",
    },
    {
      id: "c2",
      username: "game_hunter",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      content:
        "Loving the community direction here. Need more cozy recommendations.",
      createdAt: "2026-04-15T09:33:00Z",
    },
    {
      id: "c3",
      username: "driftline",
      avatar:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
      content: "Keyboard clear is wild. Did you remap boost or keep defaults?",
      createdAt: "2026-04-15T09:10:00Z",
    },
    {
      id: "c4",
      username: "arcadepulse",
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80",
      content: "The blue HUD in this game looks ridiculously clean.",
      createdAt: "2026-04-15T08:42:00Z",
    },
    {
      id: "c5",
      username: "synthdriver",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      content: "Audio sync is carrying the whole vibe. Totally agree.",
      createdAt: "2026-04-15T08:00:00Z",
    },
    {
      id: "c6",
      username: "midnightbyte",
      avatar:
        "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80",
      content: "Would love a replay mode for clips like this.",
      createdAt: "2026-04-15T07:32:00Z",
    },
    {
      id: "c7",
      username: "softpixel",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      content: "That final lane split is brutal. Nice run.",
      createdAt: "2026-04-15T07:00:00Z",
    },
  ],
  "post-2": [
    {
      id: "c8",
      username: "rpgwanderer",
      avatar:
        "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=200&q=80",
      content: "Boss readability changes are immediately noticeable.",
      createdAt: "2026-04-15T11:20:00Z",
    },
    {
      id: "c9",
      username: "ashenfox",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
      content: "Foggy courtyard zone sounds sick. Any screenshots?",
      createdAt: "2026-04-15T10:48:00Z",
    },
    {
      id: "c10",
      username: "frameperfect",
      avatar:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80",
      content: "Please keep posting patch notes like this in-feed.",
      createdAt: "2026-04-15T10:00:00Z",
    },
  ],
};
